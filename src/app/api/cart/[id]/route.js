import { neon } from "@neondatabase/serverless";

export async function GET(req, { params }) {
    try {
        const id = params.id;
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const cart = await sql`
      WITH UserCart AS (
            SELECT cart_id 
            FROM ShoppingCart 
            WHERE user_id = ${id}
            )
            SELECT 
                ci.cart_item_id,
                ci.cart_id,
                ci.quantity,
                p.product_id,
                p.product_name,
                p.product_type,
                p.price,
                p.image_url,
                s.seller_id,
                s.business_name,
                s.phone_num,
                ua.email AS seller_email,
                a.street,
                a.city,
                a.state,
                a.country,
                a.postal_code,
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'variant_id', pv.variant_id,
                            'color', split_part(pv.variant_attributes, ', ', 1),
                            'denier', split_part(pv.variant_attributes, ', ', 2),
                            'quantity', pv.quantity
                        )
                    )
                    FROM ProductVariant pv
                    WHERE pv.product_id = p.product_id
                ) AS selected_variants
            FROM 
                CartItems ci
                JOIN Products p ON ci.product_id = p.product_id
                JOIN UserCart uc ON ci.cart_id = uc.cart_id
                JOIN Sellers s ON p.seller_id = s.seller_id
                JOIN UserAccounts ua ON s.user_id = ua.user_id
                JOIN Addresses a ON s.business_address = a.address_id`;

        if (cart.length === 0) {
            return new Response(JSON.stringify({ message: "No items in the cart" }), { status: 400 });
        }

        return new Response(JSON.stringify(cart), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            body: {
                error: error.message,
            },
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
export async function PUT(request, { params }) {
    try {
        const userId = params.id;
        const requestData = await request.json();
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        console.log('Received data:', requestData, userId);

        const updatedCart = await sql`
        
            WITH user_cart AS (
                SELECT cart_id 
                FROM ShoppingCart 
                WHERE user_id = ${userId}
            )
            UPDATE CartItems 
            SET quantity = ${requestData.quantity} 
            WHERE cart_item_id = ${requestData.cartItemId} 
                AND cart_id = (SELECT cart_id FROM user_cart)
                AND (
                    ${requestData.variantId ? `variant_id = ${requestData.variantId}` : 'TRUE'}
                )
            RETURNING *
        `;


        if (updatedCart.length === 0) {
            throw new Error('Failed to update the product in the cart. No matching cart item found.');
        }

        const cartId = updatedCart[0].cart_id;

        const updatedProduct = await sql`

            SELECT 
                ci.cart_item_id,
                ci.cart_id,
                ci.quantity,
                p.product_id,
                p.product_name,
                p.product_type,
                p.price,
                p.image_url,
                (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'variant_id', pv.variant_id,
                            'color', split_part(pv.variant_attributes, ', ', 1),
                            'denier', split_part(pv.variant_attributes, ', ', 2),
                            'quantity', pv.quantity
                        )
                    )
                    FROM ProductVariant pv
                    WHERE pv.variant_id = p.product_id
                ) AS selected_variants
            FROM 
                CartItems ci
                JOIN Products p ON ci.product_id = p.product_id
                JOIN ShoppingCart sc ON ci.cart_id = sc.cart_id
            WHERE ci.cart_item_id = ${requestData.cartItemId} AND sc.cart_id = ${cartId}
        `;


        if (updatedProduct.length === 0) {
            throw new Error('Failed to get updated product of the product in the cart.');
        }

        return new Response(JSON.stringify(updatedProduct[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('PUT request error:', error);
        return new Response(JSON.stringify({
            status: 500,
            body: {
                error: error.message,
            },
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
        const id = params.id;
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        console.log('Received data:', id);
        const cartItem = await sql`
        DELETE FROM CartItems WHERE cart_item_id = ${id} RETURNING * ;`;

        if (cartItem.length === 0) {
            throw new Error('Failed to remove the product from the cart.');
        }

        return new Response(JSON.stringify(cartItem[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            body: {
                error: error.message,
            },
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

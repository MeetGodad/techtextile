// refrence - https://chatgpt.com/c/49580c39-8ae7-4ee2-93e7-5b557a398485
import { neon } from '@neondatabase/serverless';

export async function GET(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const url = new URL(req.url);
        const userId = url.pathname.split('/').pop();
        console.log("Seller ID:", userId);

        if (!userId) {
            console.error("User ID is missing in the request");
            return new Response(JSON.stringify({ message: "userId is required" }), { status: 400 });
        }
        const sellerResult = await sql`
            SELECT seller_id FROM sellers WHERE user_id = ${userId};`;

        if (sellerResult.length === 0) {
            console.error(`No seller found for user ID: ${userId}`);
            return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
        }

        const sellerId = sellerResult[0].seller_id;
        console.log("Seller ID found:", sellerId);

        const products = await sql`
            SELECT 
                p.product_id,
                p.product_name,
                p.product_description,
                p.price,
                p.image_url,
                p.product_type,
                COALESCE(y.yarn_material, 'N/A') AS yarn_material,
                COALESCE(yarn_denier.denier, 'N/A') AS yarn_denier,
                COALESCE(yarn_color.color, 'N/A') AS yarn_color,
                COALESCE(f.fabric_print_tech, 'N/A') AS fabric_print_tech,
                COALESCE(f.fabric_material, 'N/A') AS fabric_material,
                COALESCE(fabric_color.color, 'N/A') AS fabric_color
            FROM Products p
            LEFT JOIN YarnProducts y ON p.product_id = y.product_id AND p.product_type = 'yarn'
            LEFT JOIN (
                SELECT product_id, 
                       STRING_AGG(variant_value, ', ') AS denier
                FROM ProductVariant
                WHERE variant_name = 'denier'
                GROUP BY product_id
            ) AS yarn_denier ON p.product_id = yarn_denier.product_id
            LEFT JOIN (
                SELECT product_id, 
                       STRING_AGG(variant_value, ', ') AS color
                FROM ProductVariant
                WHERE variant_name = 'color' AND product_id IN (SELECT product_id FROM YarnProducts)
                GROUP BY product_id
            ) AS yarn_color ON p.product_id = yarn_color.product_id
            LEFT JOIN FabricProducts f ON p.product_id = f.product_id AND p.product_type = 'fabric'
            LEFT JOIN (
                SELECT product_id, 
                       STRING_AGG(variant_value, ', ') AS color
                FROM ProductVariant
                WHERE variant_name = 'color' AND product_id IN (SELECT product_id FROM FabricProducts)
                GROUP BY product_id
            ) AS fabric_color ON p.product_id = fabric_color.product_id
            WHERE p.seller_id = ${sellerId};`;

        if (products.length === 0) {
            console.error(`No products found for seller ID: ${sellerId}`);
            return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
        }

        console.log("Products found:", products);
        return new Response(JSON.stringify(products), { status: 200 });

    } catch (error) {
        console.error('An error occurred:', error.message);
        console.error('Stack trace:', error.stack);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}


// DELETE REQUEST
export async function DELETE(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/');
        const productId = pathSegments[pathSegments.length - 1];
        
        console.log("Product ID to delete:", productId);

        if (!productId) {
            console.error("Product ID is missing");
            return new Response(JSON.stringify({ message: "productId is required" }), { status: 400 });
        }

        // Fetch the product type to determine which table to delete from
        const productTypeResult = await sql`
            SELECT product_type FROM products WHERE product_id = ${productId};`;

        if (productTypeResult.length === 0) {
            console.error("Product not found or already deleted");
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const productType = productTypeResult[0].product_type;

        // Delete dependent records from specific tables
        if (productType === 'yarn') {
            await sql`DELETE FROM yarnproducts WHERE product_id = ${productId};`;
        } else if (productType === 'fabric') {
            await sql`DELETE FROM fabricproducts WHERE product_id = ${productId};`;
        }

        // Delete product variants
        await sql`DELETE FROM productvariant WHERE product_id = ${productId};`;

        // Delete the main product record
        const result = await sql`DELETE FROM products WHERE product_id = ${productId} RETURNING product_id;`;

        console.log("SQL Result:", result);

        if (result.length === 0) {
            console.error("Product not found or already deleted");
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        console.log("Product deleted:", productId);
        return new Response(JSON.stringify({ message: "Product deleted" }), { status: 200 });

    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        console.error('Error details:', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}



// PUT REQUEST
export async function PUT(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/');
        const productId = pathSegments[pathSegments.length - 1];
        const body = await req.json();

        const { product_type, product_name, product_description, price, image_url, yarn_material, yarn_denier, yarn_color, fabric_print_tech, fabric_material, fabric_color } = body;

        // Check if the product type is changing
        const productTypeResult = await sql`
            SELECT product_type FROM products WHERE product_id = ${productId};`;

        if (productTypeResult.length === 0) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const currentProductType = productTypeResult[0].product_type;

        if (currentProductType !== product_type) {
            return new Response(JSON.stringify({ message: "Changing product type from yarn to fabric or vice versa is not allowed. Please remove the product and add a new one." }), { status: 400 });
        }

        // Update product details in the Products table
        await sql`
            UPDATE products 
            SET product_name = ${product_name}, product_description = ${product_description}, price = ${price}, image_url = ${image_url}
            WHERE product_id = ${productId}`;

        // Update specific details based on product type
        if (product_type === 'yarn') {
            await sql`
                UPDATE yarnproducts
                SET yarn_material = ${yarn_material}
                WHERE product_id = ${productId}`;
            
            // Insert or update the variants in productvariant table
            await sql`
                DELETE FROM productvariant WHERE product_id = ${productId}`;
            await sql`
                INSERT INTO productvariant (variant_name, variant_value, product_id)
                VALUES ('denier', ${yarn_denier}, ${productId}), 
                       ('color', ${yarn_color}, ${productId})`;
        } else if (product_type === 'fabric') {
            await sql`
                UPDATE fabricproducts
                SET fabric_print_tech = ${fabric_print_tech}, fabric_material = ${fabric_material}
                WHERE product_id = ${productId}`;
            
            // Insert or update the variants in productvariant table
            await sql`
                DELETE FROM productvariant WHERE product_id = ${productId}`;
            await sql`
                INSERT INTO productvariant (variant_name, variant_value, product_id)
                VALUES ('color', ${fabric_color}, ${productId})`;
        }

        return new Response(JSON.stringify({ message: "Product updated successfully" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}

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
              p.price,
              p.image_url,
              (
                  SELECT jsonb_agg(
                      jsonb_build_object(
                          'variant_id', pv.variant_id,
                          'variant_name', pv.variant_name,
                          'variant_value', pv.variant_value
                      )
                  )
                  FROM ProductVariant pv
                  WHERE pv.variant_id = ANY(ci.variant_ids)
              ) AS selected_variants
          FROM 
              CartItems ci
              JOIN Products p ON ci.product_id = p.product_id
              JOIN UserCart uc ON ci.cart_id = uc.cart_id `;


        

        if (cart.length === 0) {
            return new Response(JSON.stringify({ message: "No items in the cart" }), { status: 400 });
        }

        return new Response(JSON.stringify(cart), {  status: 200, headers: { 'Content-Type': 'application/json' } });
        


      } catch (error) {
        return new Response(JSON.stringify({
          status: 500,
          body: {
              error: error.message,
          },
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
}


export async function PUT(request , {params}) {
  try {
      const userId = params.id;
      const requestData = await request.json();
      const databaseUrl = process.env.DATABASE_URL || "";
      const sql = neon(databaseUrl);

      console.log('Received data:', requestData ,  userId);
     
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
            (${requestData.variantIds}::int[] IS NULL AND variant_ids IS NULL)
            OR
            (${requestData.variantIds}::int[] IS NOT NULL AND variant_ids = ${requestData.variantIds}::int[])
        )
        RETURNING *, (SELECT cart_id FROM user_cart) as cart_id
      `;

      if (updatedCart.length === 0) {  
          throw new Error('Failed to update the product in the cart.');
      }

      const cartId = updatedCart[0].cart_id;
      

      const updatedProduct = await sql`
          SELECT p.*, ci.quantity
          FROM ShoppingCart sc
          JOIN CartItems ci ON sc.cart_id = ci.cart_id
          JOIN Products p ON ci.product_id = p.product_id
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
      return new Response(JSON.stringify({
          status: 500,
          body: {
              error: error.message,
          },
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, {params}) {

  try {
    
    const id = params.id;
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    console.log('Received data:', id);
    const cartItem = await sql`
    DELETE FROM CartItems WHERE cart_item_id = ${id}   RETURNING * ;`;

    if (cartItem.length === 0) {
        throw new Error('Failed to remove the product from the cart.');
    }

    return new Response(JSON.stringify(cartItem[0]), {  status: 200, headers: { 'Content-Type': 'application/json' } });

} catch (error) {
    return new Response(JSON.stringify({
        status: 500,
        body: {
            error: error.message,
        },
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}

}
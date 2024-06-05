import { neon } from "@neondatabase/serverless";

export async function GET(req, { params }) {

    try {

        const id = params.id;
        

        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const cartId = await sql`
        SELECT cart_id FROM ShoppingCart WHERE user_id = ${id}`;
        console.log("cartId", cartId[0].cart_id);

        const cartItems = await sql`
        SELECT p.* , ci.quantity FROM ShoppingCart sc
        JOIN CartItems ci ON sc.cart_id = ci.cart_id
        JOIN Products p ON ci.product_id = p.product_id
        WHERE sc.cart_id = ${cartId[0].cart_id};`;

        

        if (cartItems.length === 0) {
            return new Response(JSON.stringify({ message: "No items in the cart" }), { status: 400 });
        }

        return new Response(JSON.stringify(cartItems), {  status: 200, headers: { 'Content-Type': 'application/json' } });
        


      } catch (error) {
        return new Response(JSON.stringify({
          status: 500,
          body: {
              error: error.message,
          },
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
}


export async function PUT(request, {params}) {
  
  try {
    
    const productId = params.id;
    const requestData = await request.json();
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    await sql`
      UPDATE CartItems SET quantity = ${requestData.quantity} WHERE product_id = ${productId}
    `;

    // Get all the details of the updated product
    const updatedProduct = await sql`
      SELECT p.*, ci.quantity 
      FROM ShoppingCart sc
      JOIN CartItems ci ON sc.cart_id = ci.cart_id
      JOIN Products p ON ci.product_id = p.product_id
      WHERE p.product_id = ${productId}
    `;

    if (updatedProduct.length === 0) {
      throw new Error('Failed to update the quantity of the product in the cart.');
    }

    return new Response(JSON.stringify(updatedProduct[0]), {  status: 200, headers: { 'Content-Type': 'application/json' } });


} catch (error) {
    return new Response(JSON.stringify({
        status: 500,
        body: {
            error: error.message,
        },
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}

}

export async function DELETE(req , {params}) {

  try {
    
    const productId = params.id;
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const cartItem = await sql`
    DELETE FROM CartItems WHERE product_id = ${productId} RETURNING *`;

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
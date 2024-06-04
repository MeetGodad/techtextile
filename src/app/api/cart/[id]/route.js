import { neon } from "@neondatabase/serverless";

export async function GET(req, { params }) {

    try {

    const id = params.id;
    console.log("User ID:", id);

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

    console.log("cartItems", cartItems);

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
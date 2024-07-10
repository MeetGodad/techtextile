import { neon } from '@neondatabase/serverless';

export async function GET(req, { params }) {
  const { userId, orderId, productId } = params;
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  // Comment to mark the start of the check
  // Check if all necessary parameters are present
  if (!userId || !orderId || !productId) {
    return new Response(JSON.stringify({ message: "Missing parameters" }), { status: 400 });
  }
  // End of the check

  try {
    const orders = await sql`
      SELECT 
        o.order_id, 
        o.order_total_price, 
        o.order_status, 
        o.created_at, 
        oi.quantity, 
        p.product_name, 
        p.price, 
        p.image_url, 
        p.product_type, 
        yp.yarn_material, 
        fp.fabric_print_tech, 
        fp.fabric_material, 
        a.street, 
        a.city, 
        a.state, 
        a.postal_code
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id
      LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id
      JOIN Addresses a ON o.shipping_address_id = a.address_id
      WHERE o.user_id = ${userId} AND o.order_id = ${orderId} AND oi.product_id = ${productId};
    `;

    if (orders.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}
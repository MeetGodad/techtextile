import { neon } from "@neondatabase/serverless";

export async function GET(req) {
  try {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    
    if (pathSegments.length < 4) {
      return new Response(JSON.stringify({ message: "Invalid URL format. Expected: /api/orderDetails/{userId}/{orderId}/{productId}" }), { status: 400 });
    }
    
    const userId = pathSegments[pathSegments.length - 3];
    const orderId = pathSegments[pathSegments.length - 2];
    const productId = pathSegments[pathSegments.length - 1];

    console.log(`Fetching details for User ID: ${userId}, Order ID: ${orderId}, Product ID: ${productId}`);

    if (!userId || !orderId || !productId) {
      return new Response(JSON.stringify({ message: "User ID, Order ID, and Product ID are required" }), { status: 400 });
    }

    // Fetch order details from the database
    const orderDetails = await sql`
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
      FROM
        orders o
      JOIN orderitems oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN yarnproducts yp ON p.product_id = yp.product_id
      LEFT JOIN fabricproducts fp ON p.product_id = fp.product_id
      JOIN addresses a ON o.shipping_address_id = a.address_id
      WHERE
        o.user_id = ${userId}
        AND o.order_id = ${orderId}
        AND p.product_id = ${productId};
    `;

    console.log('Order Details:', orderDetails);

    if (orderDetails.length === 0) {
      return new Response(JSON.stringify({ message: "Order details not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(orderDetails[0]), { status: 200 });
  } catch (error) {
    console.error('An error occurred: Internal server error', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}


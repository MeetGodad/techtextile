import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { userId, shippingAddressId, selectedPaymentMethod, cart } = requestData;

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    console.log("Request Data:", requestData);

    // Calculate total price of the order
    const orderTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Insert order
    let orderId;
    try {
      const result = await sql`
        INSERT INTO orders (user_id, shipping_address_id, payment_method, order_status, order_total_price)
        VALUES (${userId}, ${shippingAddressId}, ${selectedPaymentMethod}, 'pending', ${orderTotalPrice})
        RETURNING order_id;
      `;
      orderId = result[0].order_id;
      console.log("Order inserted:", result);
    } catch (err) {
      console.error("Error inserting order:", err);
      throw new Error("Failed to insert order.");
    }

    // Insert order items
    try {
      const orderItemsPromises = cart.map(item => 
        sql`
          INSERT INTO orderitems (order_id, product_id, quantity, item_price)
          VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price});
        `
      );
      await Promise.all(orderItemsPromises);
      console.log("Order Items inserted successfully");
    } catch (err) {
      console.error("Error inserting order items:", err);
      throw new Error("Failed to insert order items.");
    }

    // Return response with order details
    return new Response(JSON.stringify({ orderId, orderTotalPrice }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error("Error in API:", error);
    return new Response(JSON.stringify({
      error: error.message,
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
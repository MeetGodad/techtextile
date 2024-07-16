import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { userId, firstName, lastName, address, city, state, zip, email, selectedPaymentMethod, cart } = requestData;
    const shippingDetails = requestData.shippingDetails;
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    console.log("Request Data:", requestData);


    // Insert shipping address
    let shippingAddress;
    try {
      shippingAddress = await sql`
        INSERT INTO addresses (user_id, address_type, address_first_name, address_last_name, address_email, street, city, state, postal_code)
        VALUES (${userId}, 'shipping', ${firstName}, ${lastName}, ${email}, ${address}, ${city}, ${state}, ${zip})
        RETURNING address_id;
      `;
      console.log("Shipping Address:", shippingAddress);
    } catch (err) {
      console.error("Error inserting shipping address:", err);
      throw new Error("Failed to insert shipping address.");
    }

    const shippingAddressId = shippingAddress[0].address_id;

    // Insert order
    let order;
    try {
      order = await sql`
        INSERT INTO orders (user_id, shipping_address_id, payment_method, order_status,order_shhipping_cost , order_total_price)
        VALUES (${userId}, ${shippingAddressId}, ${selectedPaymentMethod}, 'pending', ${requestData.totalShippingCost}  , ${requestData.totalPrice})
        RETURNING order_id;
      `;
      console.log("Order:", order);
    } catch (err) {
      console.error("Error inserting order:", err);
      throw new Error("Failed to insert order.");
    }

    const orderId = order[0].order_id;

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


    try {
      const shippingDetailsPromises = shippingDetails.map(detail => {
        const sellerIds = detail.sellerId === 'centralWarehouse' ? detail.indianSellers : [detail.sellerId];
        return sql`
          INSERT INTO ShippingDetails (
        order_id, 
        seller_ids, 
        carrier_id, 
        service_code, 
        shipping_cost, 
        is_central_warehouse
      )
      VALUES (
        ${orderId}, 
        ${sellerIds}, 
        ${detail.carrierId}, 
        ${detail.serviceCode}, 
        ${detail.amount}, 
        ${detail.sellerId === 'centralWarehouse'}
      );
    `;
      });
      await Promise.all(shippingDetailsPromises);
      console.log("Shipping Details inserted successfully");
    } catch (err) {
      console.error("Error inserting shipping details:", err);
      throw new Error("Failed to insert shipping details.");
    }

  

    return new Response(JSON.stringify({ orderId }), { 
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

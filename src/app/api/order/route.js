import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const shippingDetails = requestData.shippingDetails;
    const { userId, firstName, lastName, street, city, state, zip, email, country , selectedPaymentMethod, cart } = requestData;
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    console.log("Request Data:", requestData);


    // Insert shipping address
    let shippingAddressId;
    try {
      const existingAddress = await sql`
        SELECT address_id FROM addresses
        WHERE user_id = ${userId}
        AND address_first_name = ${firstName}
        AND address_last_name = ${lastName}
        AND address_email = ${email}
        AND street = ${street}
        AND city = ${city}
        AND state = ${state}
        AND postal_code = ${zip}
        AND country = ${country}
        AND address_type = 'shipping'
      `;


      if (existingAddress.length > 0) {
        // Address already exists, use the existing address_id
        shippingAddressId = existingAddress[0].address_id;
        console.log("Using existing shipping address:", shippingAddressId);
      } else {
        // Address doesn't exist, insert a new shipping address
        const newAddress = await sql`
          INSERT INTO addresses (user_id, address_type, address_first_name, address_last_name, address_email, street, city, state, postal_code, country)
          VALUES (${userId}, 'shipping', ${firstName}, ${lastName}, ${email}, ${street}, ${city}, ${state}, ${zip}, ${country})
          RETURNING address_id;
        `;
        shippingAddressId = newAddress[0].address_id;
        console.log("New shipping address inserted:", shippingAddressId);
      }
    } catch (err) {
      console.error("Error handling shipping address:", err);
      throw new Error("Failed to handle shipping address.");
    }

    // Insert order

    let orderId;
    try {
      const result = await sql`
        INSERT INTO orders (user_id, shipping_address_id, payment_method, order_status, original_shipping_cost, original_total_price, payment_status_check)
        VALUES (${userId}, ${shippingAddressId}, ${selectedPaymentMethod}, 'pending', ${requestData.totalShippingCost}  , ${requestData.totalPrice}, 'pending')

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

       const orderItemsPromises = cart.map(async (item) => {
    await sql`
      INSERT INTO orderitems (order_id, product_id, quantity, item_price, variant_id)
      VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price}, ${item.selected_variant.variant_id});
    `;

    await sql`
      UPDATE productvariant
      SET quantity = quantity - ${item.quantity}
      WHERE variant_id = ${item.selected_variant.variant_id};
    `;
  });
      await Promise.all(orderItemsPromises);
      console.log(orderItemsPromises);
      console.log("Order Items inserted successfully");
    } catch (err) {
      console.error("Error inserting order items:", err);
      throw new Error("Failed to insert order items.");
    }


    try {
      const shippingDetailsPromises = Object.entries(shippingDetails).map(([key, detail]) => {
        const isCentralWarehouse = key === 'centralWarehouse';
        const sellerIds = isCentralWarehouse ? detail.indianSellers : [key];
        return sql`
          INSERT INTO ShippingDetails (
            order_id, 
            seller_ids, 
            carrier_id, 
            service_code, 
            shipping_cost, 
            is_central_warehouse,
            rate_id,
            shipment_id,
            estimated_delivery_days
          )
          VALUES (
            ${orderId}, 
            ${sellerIds}, 
            ${detail.carrierId}, 
            ${detail.serviceCode}, 
            ${detail.amount}, 
            ${isCentralWarehouse},
            ${detail.rateId},
            ${detail.shipmentId},
            ${detail.deliveryDays}
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
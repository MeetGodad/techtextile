import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    const requestData = await request.json();
    console.log("Request Data:", requestData);

    // Start the transaction
    await sql`BEGIN`;

    try {
      const { userId, firstName, lastName, street, city, state, zip, email, country, phone , cart, shippingDetails, totalShippingCost, totalPrice } = requestData;

      // Handle shipping address
      let shippingAddressId;
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
        AND phone_num = ${phone}
        AND address_type = 'shipping'
      `;

      if (existingAddress.length > 0) {
        shippingAddressId = existingAddress[0].address_id;
      } else {
        const newAddress = await sql`
          INSERT INTO addresses (user_id, address_type, address_first_name, address_last_name, address_email, phone_num, street, city, state, postal_code, country)
          VALUES (${userId}, 'shipping', ${firstName}, ${lastName}, ${email}, ${phone}, ${street}, ${city}, ${state}, ${zip}, ${country})
          RETURNING address_id;
        `;
        shippingAddressId = newAddress[0].address_id;
      }

      // Insert order
      const orderResult = await sql`
        INSERT INTO orders (user_id, shipping_address_id, order_status, original_shipping_cost, original_total_price, payment_status_check)
        VALUES (${userId}, ${shippingAddressId}, 'pending', ${totalShippingCost}, ${totalPrice}, 'pending')
        RETURNING order_id;
      `;
      const orderId = orderResult[0].order_id;

      // Insert order items and update inventory
      for (const item of cart) {
        await sql`
          INSERT INTO orderitems (order_id, product_id, quantity, item_price, variant_id, item_status)
          VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price}, ${item.selected_variant.variant_id}, 'active');
        `;

        await sql`
          UPDATE productvariant
          SET quantity = quantity - ${item.quantity}
          WHERE variant_id = ${item.selected_variant.variant_id};
        `;
      }

      // Insert shipping details
      for (const [key, detail] of Object.entries(shippingDetails)) {
        const isCentralWarehouse = key === 'centralWarehouse';
        const sellerIds = isCentralWarehouse ? detail.indianSellers : [key];
        await sql`
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
      }

      // Commit the transaction
      await sql`COMMIT`;

      return new Response(JSON.stringify({ orderId }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });

    } catch (transactionError) {
      // Rollback the transaction in case of error
      await sql`ROLLBACK`;
      console.error('Transaction error:', transactionError);
      throw transactionError;
    }

  } catch (error) {
    console.error("Error in API:", error);

    let errorMessage = "Internal server error";
    let statusCode = 500;

    // Handle specific PostgreSQL error codes
    switch (error.code) {
      case '23505': // unique_violation
        errorMessage = "Duplicate entry. This order might already exist.";
        statusCode = 409; // Conflict
        break;
      case '23514': // check_violation
        errorMessage = "Invalid data. Please check your input.";
        statusCode = 400; // Bad Request
        break;
      case '23502': // not_null_violation
        errorMessage = `Missing required field: ${error.column}`;
        statusCode = 400;
        break;
      default:
        // For any other errors, keep the generic message
        break;
    }

    return new Response(JSON.stringify({
      message: errorMessage,
      error: error.message,
    }), { 
      status: statusCode, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
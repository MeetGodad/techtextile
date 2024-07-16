import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { userId, firstName, lastName, address, city, state, zip, email, selectedPaymentMethod, cart } = requestData;

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    console.log("Request Data:", requestData);

    // Calculate total price of the order
    const orderTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Insert shipping address
    let shippingAddress;
    try {
      shippingAddress = await sql`
        INSERT INTO addresses (user_id, address_type, address_first_name, address_last_name, address_email, street, city, state, postal_code)
        VALUES (${userId}, 'shipping', ${firstName}, ${lastName}, ${email}, ${address}, ${city}, ${state}, ${zip})
        RETURNING address_id;
      `;
    } catch (err) {
      console.error("Error inserting shipping address:", err);
      throw new Error("Failed to insert shipping address.");
    }

    const shippingAddressId = shippingAddress[0].address_id;

    // Insert order
    let order;
    
    try {
      order = await sql`
        INSERT INTO orders (user_id, shipping_address_id, payment_method, order_status, order_total_price)
        VALUES (${userId}, ${shippingAddressId}, ${selectedPaymentMethod}, 'pending', ${orderTotalPrice})
        RETURNING order_id;
      `;
    } catch (err) {
      console.error("Error inserting order:", err);
      throw new Error("Failed to insert order.");
    }

    const orderId = order[0].order_id;
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

    // Fetch product details
    let productDetails;
    try {
      const productIds = cart.map(item => item.product_id);
      productDetails = await sql`
        SELECT product_id, product_name AS name, image_url
        FROM products
        WHERE product_id = ANY(${productIds});
      `;
    } catch (err) {
      console.error("Error fetching product details:", err);
      throw new Error("Failed to fetch product details.");
    }

    const detailedCart = cart.map(item => {
      const product = productDetails.find(p => p.product_id === item.product_id);
      return {
        ...item,
        name: product ? product.name : "Unknown Product",
        image_url: product ? product.image_url : null,
      };
    });

    return new Response(JSON.stringify({ orderId, detailedCart, orderTotalPrice }), { 
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

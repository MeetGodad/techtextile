// import { neon } from '@neondatabase/serverless';

// export async function GET(req, { params }) {
//   const sellerUserId = params.id;
//   const databaseUrl = process.env.DATABASE_URL || "";
//   const sql = neon(databaseUrl);

//   try {
//     const result = await sql`
//       SELECT 
//         o.order_id, 
//         o.order_total_price, 
//         o.order_status, 
//         o.created_at, 
//         oi.quantity, 
//         p.product_name, 
//         p.price, 
//         p.image_url, 
//         p.product_type, 
//         yp.yarn_material, 
//         fp.fabric_print_tech, 
//         fp.fabric_material, 
//         a.street, 
//         a.city, 
//         a.state, 
//         a.postal_code,
//         ua.first_name AS buyer_first_name,
//         ua.last_name AS buyer_last_name,
//         ua.email AS buyer_email
//       FROM Orders o
//       JOIN OrderItems oi ON o.order_id = oi.order_id
//       JOIN Products p ON oi.product_id = p.product_id
//       LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id
//       LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id
//       JOIN Addresses a ON o.shipping_address_id = a.address_id
//       JOIN UserAccounts ua ON o.user_id = ua.user_id
//       JOIN Sellers s ON p.seller_id = s.seller_id
//       WHERE s.user_id = ${sellerUserId};`;

//     if (result.length === 0) {
//       return new Response(JSON.stringify([]), { status: 200 });
//     }

//     return new Response(JSON.stringify(result), { status: 200 });
//   } catch (error) {
//     console.error('An error occurred:', error);
//     return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
//   }
// }


import { neon } from '@neondatabase/serverless';

export async function GET(req, { params }) {
  const userId = params.id;  // This is the string user ID
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    // First, find the seller_id using the user_id
    const seller = await sql`
      SELECT seller_id
      FROM Sellers
      WHERE user_id = ${userId};
    `;

    if (seller.length === 0) {
      return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
    }

    const sellerId = seller[0].seller_id;

    // Now, fetch the purchased items using the seller_id
    const items = await sql`
      SELECT o.order_id, o.order_total_price, o.order_status, o.created_at,
             oi.product_id, oi.quantity, oi.item_price,
             p.product_name, p.price, p.image_url, p.product_type,
             yp.yarn_material, fp.fabric_print_tech, fp.fabric_material,
             b.user_id as buyer_id, u.first_name as buyer_first_name, u.last_name as buyer_last_name, u.email as buyer_email,
             a.street, a.city, a.state, a.postal_code
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id
      LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id
      JOIN Buyers b ON o.user_id = b.user_id
      JOIN UserAccounts u ON b.user_id = u.user_id
      JOIN Addresses a ON b.user_address = a.address_id
      WHERE p.seller_id = ${sellerId};`;

    if (!Array.isArray(items)) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

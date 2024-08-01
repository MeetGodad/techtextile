// import { neon } from '@neondatabase/serverless';

// export const fetchCache = 'force-no-store'
// export const revalidate = 0 // seconds
// export const dynamic = 'force-dynamic'

// export async function GET(req, { params }) {
//   const userId = params.id;
//   const url = new URL(req.url);
//   const statusFilter = url.searchParams.get('status');
//   const databaseUrl = process.env.DATABASE_URL || "";
//   const sql = neon(databaseUrl);

//   try {
//     const sellerResult = await sql`
//       SELECT seller_id
//       FROM Sellers
//       WHERE user_id = ${userId};
//     `;

//     if (sellerResult.length === 0) {
//       console.log('Seller not found for user_id:', userId);
//       return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
//     }

//     const sellerId = sellerResult[0].seller_id;
//     console.log('Seller ID:', sellerId);

//     let baseQuery = `
//       SELECT 
//         o.order_id,
//         o.order_status,
//         o.original_total_price,
//         o.original_shipping_cost,
//         o.created_at AS order_date,
//         oi.quantity,
//         oi.item_price,
//         p.product_name,
//         p.product_description,
//         p.price,
//         p.image_url,
//         p.product_type,
//         y.yarn_material,
//         f.fabric_print_tech,
//         f.fabric_material,
//         ua.first_name AS buyer_first_name,
//         ua.last_name AS buyer_last_name,
//         ua.email AS buyer_email,
//         a.street,
//         a.city,
//         a.state,
//         a.postal_code
//       FROM Orders o
//       JOIN OrderItems oi ON o.order_id = oi.order_id
//       JOIN Products p ON oi.product_id = p.product_id
//       LEFT JOIN YarnProducts y ON p.product_id = y.product_id
//       LEFT JOIN FabricProducts f ON p.product_id = f.product_id
//       JOIN Buyers b ON o.user_id = b.user_id
//       JOIN UserAccounts ua ON b.user_id = ua.user_id
//       JOIN Addresses a ON b.user_address = a.address_id
//       WHERE p.seller_id = ${sellerId}
//     `;

//     if (statusFilter) {
//       baseQuery += ` AND o.order_status = '${statusFilter}'`;
//     }

//     baseQuery += ` ORDER BY o.order_id, p.product_name;`;

//     const purchasedItems = await sql(baseQuery);

//     return new Response(JSON.stringify(purchasedItems), { status: 200 });
//   } catch (error) {
//     console.error('An error occurred:', error);
//     return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
//   }
// }


import { neon } from '@neondatabase/serverless';

export const fetchCache = 'force-no-store'
export const revalidate = 0 // seconds
export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  const userId = params.id;
  const url = new URL(req.url);
  const statusFilter = url.searchParams.get('status');
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    const sellerResult = await sql`
      SELECT seller_id
      FROM Sellers
      WHERE user_id = ${userId};
    `;

    if (sellerResult.length === 0) {
      console.log('Seller not found for user_id:', userId);
      return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
    }

    const sellerId = sellerResult[0].seller_id;
    console.log('Seller ID:', sellerId);

    let baseQuery = `
      SELECT 
        o.order_id,
        o.order_status,
        o.original_total_price,
        o.original_shipping_cost,
        o.created_at AS order_date,
        oi.quantity,
        oi.item_price,
        p.product_name,
        p.product_description,
        p.price,
        p.image_url,
        p.product_type,
        y.yarn_material,
        f.fabric_print_tech,
        f.fabric_material,
        ua.first_name AS buyer_first_name,
        ua.last_name AS buyer_last_name,
        ua.email AS buyer_email,
        a.street,
        a.city,
        a.state,
        a.postal_code,
        pv.variant_attributes
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      LEFT JOIN YarnProducts y ON p.product_id = y.product_id
      LEFT JOIN FabricProducts f ON p.product_id = f.product_id
      JOIN Buyers b ON o.user_id = b.user_id
      JOIN UserAccounts ua ON b.user_id = ua.user_id
      JOIN Addresses a ON b.user_address = a.address_id
      JOIN ProductVariant pv ON p.product_id = pv.product_id
      WHERE p.seller_id = ${sellerId}
    `;

    if (statusFilter) {
      baseQuery += ` AND o.order_status = '${statusFilter}'`;
    }

    baseQuery += ` ORDER BY o.order_id, p.product_name;`;

    const purchasedItems = await sql(baseQuery);

    return new Response(JSON.stringify(purchasedItems), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

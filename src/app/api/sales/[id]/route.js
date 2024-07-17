import { neon } from '@neondatabase/serverless';

export async function GET(req, { params }) {
  const userId = params.id;
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    // Fetch the seller_id based on the user_id
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

    // Fetch sales by product
    const salesByProduct = await sql`
      SELECT p.product_name, SUM(oi.quantity * oi.item_price) AS total_sales
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_name;
    `;

    // Fetch sales by category
    const salesByCategory = await sql`
      SELECT p.product_type, SUM(oi.quantity * oi.item_price) AS total_sales
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_type;
    `;

    console.log('Sales by Product:', salesByProduct);
    console.log('Sales by Category:', salesByCategory);

    return new Response(JSON.stringify({ salesByProduct, salesByCategory }), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

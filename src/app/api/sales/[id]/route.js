import { neon } from '@neondatabase/serverless';

export async function GET(req, { params }) {
  const userId = params.id;
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

    const salesByProduct = await sql`
      SELECT p.product_name, SUM(oi.quantity * oi.item_price) AS total_sales
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_name;
    `;

    const salesByCategory = await sql`
      SELECT p.product_type, SUM(oi.quantity * oi.item_price) AS total_sales
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_type;
    `;

    const totalOrders = await sql`
      SELECT COUNT(*) AS total_orders
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId};
    `;

    const orderStatus = await sql`
      SELECT o.order_status, COUNT(*) AS count
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY o.order_status;
    `;

    const averageOrderValue = await sql`
      SELECT AVG(o.order_total_price) AS avg_order_value
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId};
    `;

    const repeatOrders = await sql`
      SELECT p.product_name, p.image_url, COUNT(oi.order_id) AS order_count
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_name, p.image_url
      HAVING COUNT(oi.order_id) > 1;
    `;

    const topSellingProducts = await sql`
      SELECT p.product_name, p.image_url, SUM(oi.quantity * oi.item_price) AS total_sales
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_name, p.image_url
      ORDER BY total_sales DESC
      LIMIT 5;
    `;

    const productStockLevels = await sql`
      SELECT p.product_name, pv.quantity, p.image_url, p.price
      FROM Products p
      JOIN ProductVariant pv ON p.product_id = pv.product_id
      WHERE p.seller_id = ${sellerId};
    `;

    const lowStockAlerts = await sql`
      SELECT p.product_name, pv.quantity, p.image_url
      FROM Products p
      JOIN ProductVariant pv ON p.product_id = pv.product_id
      WHERE p.seller_id = ${sellerId} AND pv.quantity < 10;
    `;

    const monthlySales = await sql`
      SELECT 
        DATE_TRUNC('day', o.created_at) AS date,
        SUM(CASE WHEN p.product_type = 'yarn' THEN oi.quantity * oi.item_price ELSE 0 END) AS yarn_sales,
        SUM(CASE WHEN p.product_type = 'fabric' THEN oi.quantity * oi.item_price ELSE 0 END) AS fabric_sales
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      GROUP BY DATE_TRUNC('day', o.created_at)
      HAVING DATE_TRUNC('day', o.created_at) >= '2024-06-01'
      ORDER BY DATE_TRUNC('day', o.created_at);
    `;

    return new Response(JSON.stringify({
      salesByProduct,
      salesByCategory,
      totalOrders: totalOrders[0].total_orders,
      orderStatus,
      averageOrderValue: averageOrderValue[0].avg_order_value,
      repeatOrders,
      topSellingProducts,
      productStockLevels,
      lowStockAlerts,
      monthlySales,
    }), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}



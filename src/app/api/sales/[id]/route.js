import { neon } from '@neondatabase/serverless';

export const fetchCache = 'force-no-store';
export const revalidate = 0; // seconds
export const dynamic = 'force-dynamic';

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

    // Adjusted order status query
    const orderStatus = await sql`
    SELECT o.order_status, COUNT(DISTINCT o.order_id) AS count
    FROM Orders o
    JOIN OrderItems oi ON o.order_id = oi.order_id
    JOIN Products p ON oi.product_id = p.product_id
    WHERE p.seller_id = ${sellerId}
    GROUP BY o.order_status;
  `;
  

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
      SELECT COUNT(DISTINCT o.order_id) AS total_orders
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId};
    `;

    const averageOrderValue = await sql`
      SELECT AVG(o.original_total_price) AS avg_order_value
      FROM Orders o
      JOIN OrderItems oi ON o.order_id = oi.order_id
      JOIN Products p ON oi.product_id = p.product_id
      WHERE p.seller_id = ${sellerId};
    `;

    const repeatOrders = await sql`
      SELECT p.product_id, p.product_name, p.image_url, pv.variant_attributes, COUNT(oi.order_id) AS order_count
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_id, p.product_name, p.image_url, pv.variant_attributes
      HAVING COUNT(oi.order_id) > 1;
    `;

    const topSellingProducts = await sql`
      SELECT p.product_id, p.product_name, p.image_url, pv.variant_attributes, SUM(oi.quantity * oi.item_price) AS total_sales
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.product_id
      JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
      WHERE p.seller_id = ${sellerId}
      GROUP BY p.product_id, p.product_name, p.image_url, pv.variant_attributes
      ORDER BY total_sales DESC
      LIMIT 5;
    `;

    const productStockLevels = await sql`
      SELECT p.product_id, p.product_name, pv.quantity, p.image_url, p.price, pv.variant_attributes
      FROM Products p
      JOIN ProductVariant pv ON p.product_id = pv.product_id
      WHERE p.seller_id = ${sellerId};
    `;

    const lowStockAlerts = await sql`
      SELECT p.product_id, p.product_name, pv.quantity, p.image_url, pv.variant_attributes
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

    // Group product variants under a single product
    const groupVariants = (products) => {
      const groupedProducts = {};
      products.forEach(product => {
        if (!groupedProducts[product.product_id]) {
          groupedProducts[product.product_id] = {
            ...product,
            variants: []
          };
        }
        groupedProducts[product.product_id].variants.push({
          variant_attributes: product.variant_attributes,
          quantity: product.quantity
        });
      });
      return Object.values(groupedProducts);
    };

    return new Response(JSON.stringify({
      salesByProduct,
      salesByCategory,
      totalOrders: totalOrders[0].total_orders,
      orderStatus,
      averageOrderValue: averageOrderValue[0].avg_order_value,
      repeatOrders: groupVariants(repeatOrders),
      topSellingProducts: groupVariants(topSellingProducts),
      productStockLevels: groupVariants(productStockLevels),
      lowStockAlerts: groupVariants(lowStockAlerts),
      monthlySales,
    }), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

// refrence - https://chatgpt.com/c/b17460af-4df2-4623-91ff-d830dca4d51c

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
      return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
    }

    const sellerId = sellerResult[0].seller_id;

    const reviews = await sql`
      SELECT 
        p.product_name,
        p.image_url AS product_image,
        p.price AS product_price,
        p.product_type,
        f.feedback_heading,
        f.feedback_text,
        f.feedback_rating,
        ua.first_name || ' ' || ua.last_name AS buyer_name
      FROM Feedback f
      JOIN Products p ON f.product_id = p.product_id
      JOIN UserAccounts ua ON f.user_id = ua.user_id
      WHERE p.seller_id = ${sellerId};
    `;

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

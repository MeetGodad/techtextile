import { neon } from "@neondatabase/serverless";

export async function GET(request, { params }) {
  const orderId = params.id;

  if (!orderId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const orders = await sql`
      SELECT * FROM orders
      WHERE order_id = ${orderId};
    `;

    return new Response(JSON.stringify(orders), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
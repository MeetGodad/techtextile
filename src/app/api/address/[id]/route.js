import { neon } from "@neondatabase/serverless";

export async function GET(request, { params }) {
  const userId = params.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const addresses = await sql`
      SELECT * FROM addresses
      WHERE user_id = ${userId};
    `;

    return new Response(JSON.stringify(addresses), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch address' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
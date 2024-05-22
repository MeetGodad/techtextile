import { neon } from '@neondatabase/serverless';

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);
  const response = await sql`SELECT * FROM Marketplace;`;

  if (response.length === 0) {
    return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
  }
  return new Response(JSON.stringify(response), { status: 200 });
}
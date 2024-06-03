import { neon } from '@neondatabase/serverless';

export async function GET(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const url = new URL(req.url);
        const userId = url.pathname.split('/').pop();
        console.log("Seller ID:", userId);

        if (!userId) {
            return new Response(JSON.stringify({ message: "userId is required" }), { status: 400 });
        }

       
        
        // Use a parameterized query to prevent SQL injection
        const seller_id = await sql`
            SELECT seller_id FROM sellers WHERE user_id = ${userId};`;

        if (seller_id.length === 0) {
            return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Products found", seller_id }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

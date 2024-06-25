// refrence - https://chatgpt.com/c/49580c39-8ae7-4ee2-93e7-5b557a398485
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
        const sellerResult = await sql`
            SELECT seller_id FROM sellers WHERE user_id = ${userId};`;

        if (sellerResult.length === 0) {
            return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
        }

        // const sellerId = sellerResult[0].seller_id;

        const products = await sql`
            SELECT * FROM Products WHERE seller_id = ${sellerResult[0].seller_id};`;

        if (products.length === 0) {
            return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
        }

        console.log("Response Seller Product:", products);
        return new Response(JSON.stringify(products), { status: 200 });

    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

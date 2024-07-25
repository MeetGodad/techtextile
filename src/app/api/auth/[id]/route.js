import { neon } from '@neondatabase/serverless';

export async function GET(req, { params }) {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    
    try {
        const id = params.id;
        console.log("User ID:", id);

        const response = await sql`SELECT * FROM useraccounts WHERE user_id = ${id};`;

        if (response.length === 0) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "User found", user: response[0] }), { status: 200 });
    } catch (error) {
        console.error('An error occurred:', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}
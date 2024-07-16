import { neon } from "@neondatabase/serverless";

export async function GET(req , { params }) {
    try {
        const id = params.id;
        console.log('id' , id)
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const relatedProducts = await sql`
            SELECT * FROM get_related_products(${id}, 12);`;

        if (relatedProducts.length === 0) {
            return new Response(JSON.stringify({ message: "No related products found" }), { status: 404 });
        }

        return new Response(JSON.stringify(relatedProducts), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            body: {
                error: error.message,
            },
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

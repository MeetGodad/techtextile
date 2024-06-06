import { neon } from "@neondatabase/serverless"; 


export async function GET(req, { params }) {

    try{

        const id = params.id;  
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const sellerId = await sql`
        SELECT seller_id FROM sellers WHERE user_id = ${id}`
        
        const products = await sql`
        SELECT * FROM Products WHERE seller_id = ${sellerId[0].seller_id}`;
    
        if (products.length === 0) {
            return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
        }

        console.log("Response Seller Product :" , products);
        return new Response(JSON.stringify(products), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            message: "Internal Server Error",
            error: error.message
        }), { status: 500 });
    }
}


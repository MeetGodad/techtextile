import { neon } from "@neondatabase/serverless"; 


export async function GET(req, { params }) {
    const id = params.id;  
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const sellerId = await sql`
        SELECT seller_id FROM sellers WHERE user_id = ${id};`;

    if (sellerId.length === 0) {
        return new Response(JSON.stringify({ message: "Seller not found" }), { status: 404 });
    }
    //query was made by chat gpt
    const products = await sql ` SELECT *
            FROM Products WHERE seller_id = ${sellerId[0].seller_id};`;

    if (products.length === 0) {
        return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
    }

    console.log("Response" , Response);
    return new Response(JSON.stringify(products), { status: 200 });
    
}


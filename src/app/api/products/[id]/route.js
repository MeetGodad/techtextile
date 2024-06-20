import { neon } from "@neondatabase/serverless";


export async function GET(req, { params }) {  
    const id = params.id;
    console.log("User ID:", id);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const Products = await sql`SELECT * FROM Products 
    WHERE product_id = ${id};`; 


    if (Products.length === 0) {
        return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(Products), { status: 200 });

}
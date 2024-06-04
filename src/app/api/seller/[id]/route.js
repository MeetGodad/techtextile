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

    const products = await sql ` SELECT p.*
            FROM Products p
            LEFT JOIN YarnProducts y ON p.product_id = y.product_id
            LEFT JOIN FabricProducts f ON p.product_id = f.product_id
            WHERE p.seller_id = ${sellerId[0].seller_id}
            `

    if (products.length === 0) {
        return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
    }

    console.log("Response" , Response);
    return new Response(JSON.stringify(products), { status: 200 });
    
}


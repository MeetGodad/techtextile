// import { neon } from "@neondatabase/serverless"; 


// export async function GET(req, { params }) {

//     try{

//         const id = params.id;  
//         const databaseUrl = process.env.DATABASE_URL || "";
//         const sql = neon(databaseUrl);

//         const sellerId = await sql`
//         SELECT seller_id FROM sellers WHERE user_id = ${id}`
        
//         const products = await sql`
//         SELECT * FROM Products WHERE seller_id = ${sellerId[0].seller_id}`;
    
//         if (products.length === 0) {
//             return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
//         }

//         console.log("Response Seller Product :" , products);
//         return new Response(JSON.stringify(products), { status: 200 });

//     } catch (error) {
//         return new Response(JSON.stringify({
//             message: "Internal Server Error",
//             error: error.message
//         }), { status: 500 });
//     }
// }

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

        const sellerId = sellerResult[0].seller_id;

        const products = await sql`
            SELECT * FROM Products WHERE seller_id = ${sellerId};`;

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

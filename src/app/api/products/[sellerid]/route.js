// import { neon } from '@neondatabase/serverless';

// export async function GET(req) {
//     try {
        
//         const url = new URL(req.url);
//         const sellerid = url.pathname.split('/').pop();
//         console.log("Seller ID:", sellerid);

//         if (!sellerid) {
//             return new Response(JSON.stringify({ message: "seller_id is required" }), { status: 400 });
//         }

//         const databaseUrl = process.env.DATABASE_URL || "";
//         const sql = neon(databaseUrl);
//         const products = await sql`
//             SELECT * FROM Products WHERE seller_id = ${sellerid};`;

//         if (products.length === 0) {
//             return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ message: "Products found", products }), { status: 200 });
//     } catch (error) {
//         console.error('An error occurred: Internal server error', error);
//         return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
//     }
// }

import { neon } from '@neondatabase/serverless';

export async function GET(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        // Extract seller ID from request URL
        const url = new URL(req.url);
        const sellerId = url.pathname.split('/').pop();
        
        if (!sellerId) {
            return new Response(JSON.stringify({ message: "Seller ID not provided" }), { status: 400 });
        }

        const products = await sql`
            SELECT * FROM Products WHERE seller_id = ${sellerId};
        `;
        console.log("Products:", products);

        if (products.length === 0) {
            return new Response(JSON.stringify({ message: "No items listed" }), { status: 404 });
        }

        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

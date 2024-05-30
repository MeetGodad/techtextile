import { neon } from '@neondatabase/serverless';

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            console.log('User ID is missing');
            return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
        }

        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        console.log('Database URL:', databaseUrl);
        console.log('Fetching seller_id for userId:', userId);

        const sellerResponse = await sql`
            SELECT seller_id FROM sellers WHERE user_id = ${userId};
        `;

        if (sellerResponse.length === 0) {
            console.log('No seller found for this user');
            return new Response(JSON.stringify({ message: "No seller found for this user" }), { status: 404 });
        }

        const sellerId = sellerResponse[0].seller_id;
        console.log('Found sellerId:', sellerId);

        const productResponse = await sql`
            SELECT * FROM Products WHERE seller_id = ${sellerId};
        `;

        console.log('SQL response:', productResponse);

        if (productResponse.length === 0) {
            console.log('No products found for this seller');
            return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
        }

        return new Response(JSON.stringify({ items: productResponse }), { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

// import { neon } from '@neondatabase/serverless';

// export async function GET(req) {
//     try {
//         const sellerId = 12; // Using seller_id 9 for demonstration

//         const databaseUrl = process.env.DATABASE_URL || "";
//         const sql = neon(databaseUrl);

//         console.log('Fetching products for sellerId:', sellerId);
//         const productResponse = await sql`
//             SELECT product_name FROM Products WHERE seller_id = ${sellerId};
//         `;

//         console.log('SQL response:', productResponse);

//         if (productResponse.length === 0) {
//             console.log('No products found for this seller');
//             return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ items: productResponse }), { status: 200 });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
//     }
// }

//this code is genrated by chat gpt
// src/app/api/display_data/route.js

// import { neon } from '@neondatabase/serverless';

// export async function GET(req) {
//     try {
//         const databaseUrl = process.env.DATABASE_URL || "";
//         const sql = neon(databaseUrl);

//         // Hardcoding seller_id for demonstration
//         const sellerId = 9;

//         console.log('Fetching products for sellerId:', sellerId);
//         const productResponse = await sql`
//             SELECT product_name FROM Products WHERE seller_id = ${sellerId};
//         `;

//         console.log('SQL response:', productResponse);

//         if (productResponse.length === 0) {
//             console.log('No products found for this seller');
//             return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
//         }

//         return new Response(JSON.stringify({ items: productResponse }), { status: 200 });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
//     }
// }


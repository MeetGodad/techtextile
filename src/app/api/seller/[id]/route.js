import { neon } from '@neondatabase/serverless';

// GET REQUEST
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

// DELETE REQUEST
export async function DELETE(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const url = new URL(req.url);
        const pathSegments = url.pathname.split('/');
        const productId = pathSegments[pathSegments.length - 1];
        console.log("Product ID to delete:", productId);

        if (!productId) {
            return new Response(JSON.stringify({ message: "productId is required" }), { status: 400 });
        }

        // Used a parameterized query to prevent SQL injection
        const result = await sql`
            DELETE FROM Products WHERE product_id = ${productId};`;

        if (result.count === 0) {
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        console.log("Product deleted:", productId);
        return new Response(JSON.stringify({ message: "Product deleted" }), { status: 200 });

    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

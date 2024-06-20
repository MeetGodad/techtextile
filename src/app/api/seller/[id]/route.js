import { neon } from '@neondatabase/serverless';
import { bucket } from '@/app/auth/firebaseAdmin';
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

        // Used a parameterized query to prevent SQL injection
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
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
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
            console.error("Product ID is missing");
            return new Response(JSON.stringify({ message: "productId is required" }), { status: 400 });
        }

        // Delete dependent records from yarnproducts and fabricproducts
        await sql`
            DELETE FROM yarnproducts WHERE product_id = ${productId};`;
        console.log("Dependent records deleted from yarnproducts");

        await sql`
            DELETE FROM fabricproducts WHERE product_id = ${productId};`;
        console.log("Dependent records deleted from fabricproducts");

        const result = await sql`
            DELETE FROM Products WHERE product_id = ${productId} RETURNING product_id;`;
        console.log("SQL Result:", result);

        if (result.length === 0) {
            console.error("Product not found or already deleted");
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        console.log("Product deleted:", productId);
        return new Response(JSON.stringify({ message: "Product deleted" }), { status: 200 });

    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        console.error('Error details:', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}


// Delete Request that also delete's the image from firebase
// export async function DELETE(req) {
//     try {
//         const databaseUrl = process.env.DATABASE_URL || "";
//         const sql = neon(databaseUrl);
//         const url = new URL(req.url);
//         const pathSegments = url.pathname.split('/');
//         const productId = pathSegments[pathSegments.length - 1];
//         console.log("Product ID to delete:", productId);

//         if (!productId) {
//             console.error("Product ID is missing");
//             return new Response(JSON.stringify({ message: "productId is required" }), { status: 400 });
//         }

//         // Verify the product exists before attempting to delete
//         const productCheck = await sql`
//             SELECT * FROM Products WHERE product_id = ${productId};`;

//         if (productCheck.length === 0) {
//             console.error(`Product with ID ${productId} not found`);
//             return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
//         }

//         console.log("Product exists, proceeding with deletion");

//         // Manually delete related records in yarnproducts table
//         const relatedDeleteResult = await sql`
//             DELETE FROM yarnproducts WHERE product_id = ${productId};`;

//         console.log("Related records deleted from yarnproducts table:", relatedDeleteResult);

//         // Delete the product images from Firebase Storage
//         const imagePath = `images/${productId}/`; // Assuming your image paths are stored in this format
//         const [files] = await bucket.getFiles({ prefix: imagePath });
//         const deletePromises = files.map(file => file.delete());

//         await Promise.all(deletePromises);
//         console.log(`Images deleted from Firebase Storage for product ID ${productId}`);

//         // Use a parameterized query to prevent SQL injection
//         const result = await sql`
//             DELETE FROM Products WHERE product_id = ${productId};`;

//         console.log("SQL Result:", result);

//         if (result.count === 0) {
//             console.error("Deletion affected no rows");
//             return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
//         }

//         console.log("Product deleted:", productId);
//         return new Response(JSON.stringify({ message: "Product deleted" }), { status: 200 });

//     } catch (error) {
//         console.error('An error occurred: Internal server error', error);
//         console.error('Error details:', error);
//         return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
//     }
// }


// Put Request
export async function PUT(req) {
    try {
        const requestData = await req.json();
        const { product_id, product_name, description, price, image_url, product_type, yarn_type, yarn_denier, yarn_color, fabric_type, fabric_print_tech, fabric_material, fabric_color } = requestData;

        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        // Update the main product details
        await sql`
            UPDATE Products
            SET product_name = ${product_name}, product_description = ${description}, price = ${price}, image_url = ${image_url}
            WHERE product_id = ${product_id};`;

        if (product_type === 'yarn') {
            await sql`
                UPDATE YarnProducts
                SET yarn_type = ${yarn_type}, yarn_denier = ${yarn_denier}, yarn_color = ${yarn_color}
                WHERE product_id = ${product_id};`;
        } else if (product_type === 'fabric') {
            await sql`
                UPDATE FabricProducts
                SET fabric_type = ${fabric_type}, fabric_print_tech = ${fabric_print_tech}, fabric_material = ${fabric_material}, fabric_color = ${fabric_color}
                WHERE product_id = ${product_id};`;
        }

        return new Response(JSON.stringify({ message: "Product updated successfully" }), { status: 200 });

    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}
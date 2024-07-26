import { neon } from '@neondatabase/serverless';

export async function GET() {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const products = await sql`
            SELECT p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, 
                   yp.yarn_material, fp.fabric_print_tech, fp.fabric_material, 
                   COALESCE(pr.average_rating, 0) AS average_rating
            FROM Products p 
            LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id 
            LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id
            LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id 
            LEFT JOIN product_ratings pr ON p.product_id = pr.product_id
            GROUP BY p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, 
                     p.product_type, yp.yarn_material, fp.fabric_print_tech, fp.fabric_material, pr.average_rating;`;

        if (products.length === 0) {
            return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
        }

        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}


export async function POST(req) {
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    
    try {
        const requestData = await req.json();
        console.log("Requested Data:", requestData);

        // Start the transaction
        await sql`BEGIN`;

        try {
            // Get seller_id
            const seller = await sql`
                SELECT seller_id FROM sellers WHERE user_id = ${requestData.userId};
            `;

            if (seller.length === 0) {
                throw new Error("Seller not found");
            }

            const seller_id = seller[0].seller_id;

            // Insert product
            const product_details = await sql`
                INSERT INTO Products (product_name, product_description, price, image_url, seller_id, product_type)
                VALUES (${requestData.product_name}, ${requestData.description}, ${requestData.price}, ${requestData.image_url}, ${seller_id}, ${requestData.product_type})
                RETURNING product_id;
            `;

            const productId = product_details[0].product_id;

            if (requestData.product_type === 'yarn') {
                await sql`
                    INSERT INTO YarnProducts (product_id, yarn_material)
                    VALUES (${productId}, ${requestData.yarn_material});
                `;

                for (let variant of requestData.yarn_variants) {
                    for (let denier of variant.deniers) {
                        const variantAttributes = `Color: ${variant.color}, Denier: ${denier.denier}`;
                        await sql`
                            INSERT INTO ProductVariant (product_id, variant_attributes, quantity)
                            VALUES (${productId}, ${variantAttributes}, ${denier.quantity});
                        `;
                    }
                }
            } else if (requestData.product_type === 'fabric') {
                await sql`
                    INSERT INTO FabricProducts (product_id, fabric_print_tech, fabric_material)
                    VALUES (${productId}, ${requestData.fabric_print_tech}, ${requestData.fabric_material});
                `;

                for (let variant of requestData.fabric_variants) {
                    const variantAttributes = `Color: ${variant.color}`;
                    await sql`
                        INSERT INTO ProductVariant (product_id, variant_attributes, quantity)
                        VALUES (${productId}, ${variantAttributes}, ${variant.quantity});
                    `;
                }
            } else {
                throw new Error("Invalid product type");
            }

            // Commit the transaction
            await sql`COMMIT`;

            return new Response(JSON.stringify({ message: "Product added successfully", productId: productId }), { status: 200 });
        } catch (transactionError) {
            // Rollback the transaction in case of error
            await sql`ROLLBACK`;
            console.error('Transaction error:', transactionError);
            return new Response(JSON.stringify({ message: "Failed to add product", error: transactionError.message }), { status: 400 });
        }
    } catch (error) {
        console.error('An error occurred:', error);

        let errorMessage = "Internal server error";
        let statusCode = 500;

        // Handle specific PostgreSQL error codes
        switch (error.code) {
            case '23505': // unique_violation
                errorMessage = "Duplicate entry. This product might already exist.";
                statusCode = 409; // Conflict
                break;
            case '23514': // check_violation
                errorMessage = "Invalid data. Please check your input.";
                statusCode = 400; // Bad Request
                break;
            case '23502': // not_null_violation
                errorMessage = `Missing required field: ${error.column}`;
                statusCode = 400;
                break;
            default:
                // For any other errors, keep the generic message
                break;
        }

        return new Response(JSON.stringify({ message: errorMessage, error: error.message }), { status: statusCode });
    }
}
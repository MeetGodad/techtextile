import { neon } from '@neondatabase/serverless';


export async function GET() {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const products = await sql`
            SELECT p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, yp.yarn_material, fp.fabric_print_tech, fp.fabric_material
            FROM Products p LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id
            LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id
            GROUP BY p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, yp.yarn_material, fp.fabric_print_tech, fp.fabric_material;`;

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
    try {
        console.log("Parsing request data");
        const requestData = await req.json();
        console.log("Requested Data2:", requestData);

        const databaseUrl = process.env.DATABASE_URL || "";
        console.log("Database URL:", databaseUrl);

        const sql = neon(databaseUrl);
        console.log("Executing SQL queries");

        const seller_id = await sql`
        SELECT seller_id FROM sellers WHERE user_id = ${requestData.userId};`;

        const product_details = await sql`
            INSERT INTO Products (product_name, product_description, price, image_url, seller_id, product_type)
            VALUES (${requestData.product_name}, ${requestData.description}, ${requestData.price}, ${requestData.image_url},             
                 ${seller_id[0].seller_id}, ${requestData.product_type})
            RETURNING product_id;
        `;
        const productId = product_details[0].product_id;
        console.log("Product inserted with ID:", productId);

        if (requestData.product_type === 'yarn') {
            const Yarn = await sql`
                INSERT INTO YarnProducts (product_id, yarn_material)
                VALUES (${productId}, ${requestData.yarn_material})
                RETURNING yarn_id;
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
            const Fabric = await sql`
                INSERT INTO FabricProducts (product_id, fabric_print_tech, fabric_material)
                VALUES (${productId}, ${requestData.fabric_print_tech}, ${requestData.fabric_material})
                RETURNING fabric_id;
            `;

            for (let variant of requestData.fabric_variants) {
                const variantAttributes = `Color: ${variant.color}`;
                await sql`
                    INSERT INTO ProductVariant (product_id, variant_attributes, quantity)
                    VALUES (${productId}, ${variantAttributes}, ${variant.quantity});
                `;
            }
        }

        return new Response(JSON.stringify({ message: "Data inserted successfully" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

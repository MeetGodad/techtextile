import { neon } from '@neondatabase/serverless';

export async function GET(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);

        const url = new URL(req.url);
        const productId = url.searchParams.get('productId');

        if (productId) {
            const product = await sql`
                SELECT * FROM Products WHERE product_id = ${productId};
            `;

            if (product.length === 0) {
                return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
            }

            return new Response(JSON.stringify(product[0]), { status: 200 });
        } else {
            const products = await sql`
                SELECT * FROM Products;
            `;

            if (products.length === 0) {
                return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
            }

            return new Response(JSON.stringify(products), { status: 200 });
        }
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
        console.log("ProductVariant inserted with ID:", productId);

    if (requestData.product_type === 'yarn'){const Yarn = await sql`
            INSERT INTO YarnProducts (product_id, yarn_material)
            VALUES (${productId}, 
                 ${requestData.yarn_type})
            RETURNING yarn_id; `;
            
        
        for (let color of requestData.yarn_color) {
            await sql`
                INSERT INTO ProductVariant (product_id, variant_name , variant_value)
                VALUES (${productId}, 'color', ${color});`;
        }

        for (let denier of requestData.yarn_denier) {
            await sql`
                INSERT INTO ProductVariant (product_id, variant_name , variant_value)
                VALUES (${productId}, 'denier', ${denier});`;
        }
    }
    else if (requestData.product_type === 'fabric'){const Fabric = await sql`
            INSERT INTO FabricProducts (product_id, fabric_print_tech, fabric_material)
            VALUES (${productId}, ${requestData.fabric_print_tech}, ${requestData.fabric_material})
            RETURNING fabric_id;`;   

        for (let color of requestData.fabric_color) {
            await sql`
                INSERT INTO ProductVariant (product_id, variant_name , variant_value)
                VALUES (${productId}, 'color', ${color});`;
        }
    }

        return new Response(JSON.stringify({ message: "Data inserted successfully" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

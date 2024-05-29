import { neon } from '@neondatabase/serverless';

export async function POST(req) {
    try {
        console.log("Parsing request data");
        const requestData = await req.json();
        console.log("Requested Data:", requestData);

        const databaseUrl = process.env.DATABASE_URL || "";
        console.log("Database URL:", databaseUrl);

        const sql = neon(databaseUrl);
        console.log("Executing SQL queries");

        const product_details = await sql`
            INSERT INTO Products (product_name, product_description, price, image_url, seller_id,product_type)
            VALUES (${requestData.product_name}, ${requestData.description}, ${requestData.price}, ${requestData.image_url},             
                 ${requestData.seller_id},${requestData.product_type})
            RETURNING product_id;
        `;
        const productId = product_details[0].product_id;
        console.log("ProductVariant inserted with ID:", productId);

      if (requestData.product_type === 'yarn'){const Yarn = await sql`
            INSERT INTO YarnProducts (product_id, yarn_type,yarn_denier,yarn_color)
            VALUES (${productId}, 
                 ${requestData.yarn_type},${requestData.yarn_denier},${requestData.yarn_color})
            RETURNING yarn_id; `;
            
        const yarnId = Yarn[0].yarn_id;
        console.log("Category inserted with ID:", yarnId);
    }
    else if (requestData.product_type === 'fabric'){const Fabric = await sql`
            INSERT INTO FabricProducts (product_id, fabric_type, fabric_print_tech, fabric_material, fabric_color)
            VALUES (${productId}, ${requestData.fabric_type}, ${requestData.fabric_print_tech}, ${requestData.fabric_material},         
                 ${requestData.fabric_color})
            RETURNING fabric_id;`;   

        const fabricId = Fabric[0].fabric_id;
        console.log("Marketplace data inserted successfully", fabricId);
    }

        return new Response(JSON.stringify({ message: "Data inserted successfully" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

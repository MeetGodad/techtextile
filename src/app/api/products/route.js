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

        console.log("Requested Data:", requestData);

        const databaseUrl = process.env.DATABASE_URL || "";
        console.log("Database URL:", databaseUrl);

        const sql = neon(databaseUrl);
        console.log("Executing SQL queries");

        const productVariantResult = await sql`
            INSERT INTO ProductVariant (yarnBrand, yarnDanier, fabricMaterial, fabricPrintTech, color)
            VALUES (${requestData.yarnBrand}, ${requestData.yarnDanier}, ${requestData.fabricMaterial}, ${requestData.fabricPrintTech}, ${requestData.color})
            RETURNING variantid;
        `;
        const variantId = productVariantResult[0].variantid;
        console.log("ProductVariant inserted with ID:", variantId);

      
        const categoryResult = await sql`
            INSERT INTO Category (categoryName, parentCategory_id)
            VALUES (${requestData.categoryName}, ${requestData.parentCategory_id})
            RETURNING category_id;
        `;
        const categoryId = categoryResult[0].category_id;
        console.log("Category inserted with ID:", categoryId);

        const marketplaceResult = await sql`
            INSERT INTO Marketplace (product_name, product_details, product_image, product_price, category_id, variantId, userId)
            VALUES (${requestData.product_name}, ${requestData.product_details}, ${requestData.product_image}, ${requestData.product_price}, ${categoryId}, ${variantId}, ${requestData.userId})
            RETURNING *;
        `;
        console.log("Marketplace data inserted successfully", marketplaceResult);


        return new Response(JSON.stringify({ message: "Data inserted successfully" }), { status: 200 });
    } catch (error) {
        console.error('An error occurred: Internal server error', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }

}


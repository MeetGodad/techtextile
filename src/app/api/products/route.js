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

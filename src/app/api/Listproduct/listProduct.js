import  {neon} from '@neondatabase/serverless';


import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  const requestData = await request.json();
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  // Begin a transaction
  await sql.begin();

  try {
    // Insert into Marketplace
    const marketplaceResponse = await sql`
      INSERT INTO Marketplace (name, details, image, price, category_id, variantId, userId)
      VALUES (${requestData.name}, ${requestData.details}, ${requestData.image}, ${requestData.price}, ${requestData.category_id}, ${requestData.variantId}, ${requestData.userId})
      RETURNING product_id;
    `;

    // Insert into ProductVariant
    await sql`
      INSERT INTO ProductVariant (variantId, yarnBrand, yarnDanier, fabricMaterial, fabricPrintTech, color)
      VALUES (${requestData.variantId}, ${requestData.yarnBrand}, ${requestData.yarnDanier}, ${requestData.fabricMaterial}, ${requestData.fabricPrintTech}, ${requestData.color})
    `;

    // Insert into Category
    await sql`
      INSERT INTO Category (category_id, categoryName, parentCategory_id)
      VALUES (${requestData.category_id}, ${requestData.categoryName}, ${requestData.parentCategory_id})
    `;

    // Commit the transaction
    await sql.commit();

    return new Response(JSON.stringify(marketplaceResponse), { status: 200 });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await sql.rollback();
    return new Response(JSON.stringify({ message: "Error: " + error.message }), { status: 500 });
  }
}
import { neon } from '@neondatabase/serverless';

export const fetchCache = 'force-no-store'
export const revalidate = 0 // seconds
export const dynamic = 'force-dynamic'

export async function GET(req) {
    try {
        const databaseUrl = process.env.DATABASE_URL || "";
        const sql = neon(databaseUrl);
        const url = new URL(req.url);
        const userId = url.pathname.split('/').pop();

        if (!userId) {
            console.error("User ID is missing in the request");
            return new Response(JSON.stringify({ message: "userId is required" }), { status: 400 });
        }

        const sellerResult = await sql`
            SELECT seller_id FROM Sellers WHERE user_id = ${userId};`;

        if (sellerResult.length === 0) {
            console.error(`No seller found for user ID: ${userId}`);
            return new Response(JSON.stringify({ message: "No products found for this seller" }), { status: 404 });
        }

        const sellerId = sellerResult[0].seller_id;

        const products = await sql`
            SELECT 
                p.product_id,
                p.product_name,
                p.product_description,
                p.price,
                p.image_url,
                p.product_type,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'variant_id', variant.variant_id,
                        'attributes', variant.variant_attributes,
                        'quantity', variant.quantity
                    )
                ) AS variants
            FROM Products p
            LEFT JOIN ProductVariant variant ON p.product_id = variant.product_id
            WHERE p.seller_id = ${sellerId}
            GROUP BY p.product_id;`;

        if (products.length === 0) {
            console.error(`No products found for seller ID: ${sellerId}`);
            return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
        }

        return new Response(JSON.stringify(products), { status: 200 });

    } catch (error) {
        console.error('An error occurred:', error.message);
        console.error('Stack trace:', error.stack);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
}

//PUT Request
export async function PUT(req) {
    const sql = neon(process.env.DATABASE_URL || "");
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const productId = pathSegments[pathSegments.length - 1];

    try {
        const body = await req.json();
        const { product_type, product_name, product_description, price, image_url, yarn_variants, fabric_variants } = body;

        // Start transaction
        await sql`BEGIN`;

        const productTypeResult = await sql`
            SELECT product_type FROM products WHERE product_id = ${productId};`;

        if (productTypeResult.length === 0) {
            await sql`ROLLBACK`;
            return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
        }

        const currentProductType = productTypeResult[0].product_type;
        if (currentProductType !== product_type) {
            await sql`ROLLBACK`;
            return new Response(JSON.stringify({ message: "Changing product type from yarn to fabric or vice versa is not allowed. Please remove the product and add a new one." }), { status: 400 });
        }

        await sql`
            UPDATE products 
            SET product_name = ${product_name}, product_description = ${product_description}, price = ${price}, image_url = ${image_url}
            WHERE product_id = ${productId}`;

        // Update existing variants and add new ones
        if (product_type === 'yarn') {
            for (const variant of yarn_variants) {
                for (const denier of variant.deniers) {
                    const variantAttributes = `Color: ${variant.color}, Denier: ${denier.denier}`;
                    const existingVariant = await sql`
                        SELECT variant_id FROM productvariant 
                        WHERE product_id = ${productId} AND variant_attributes = ${variantAttributes};`;

                    if (existingVariant.length > 0) {
                        // Update the existing variant quantity
                        await sql`
                            UPDATE productvariant
                            SET quantity = ${denier.quantity}
                            WHERE variant_id = ${existingVariant[0].variant_id};`;
                    } else {
                        // Insert new variant
                        await sql`
                            INSERT INTO productvariant (product_id, variant_attributes, quantity)
                            VALUES (${productId}, ${variantAttributes}, ${denier.quantity});`;
                    }
                }
            }
        } else if (product_type === 'fabric') {
            for (const variant of fabric_variants) {
                const variantAttributes = `Color: ${variant.color}`;
                const existingVariant = await sql`
                    SELECT variant_id FROM productvariant 
                    WHERE product_id = ${productId} AND variant_attributes = ${variantAttributes};`;

                if (existingVariant.length > 0) {
                    // Update the existing variant quantity
                    await sql`
                        UPDATE productvariant
                        SET quantity = ${variant.quantity}
                        WHERE variant_id = ${existingVariant[0].variant_id};`;
                } else {
                    // Insert new variant
                    await sql`
                        INSERT INTO productvariant (product_id, variant_attributes, quantity)
                        VALUES (${productId}, ${variantAttributes}, ${variant.quantity});`;
                }
            }
        }

        // Commit transaction
        await sql`COMMIT`;

        return new Response(JSON.stringify({ message: "Product updated successfully" }), { status: 200 });
    } catch (error) {
        await sql`ROLLBACK`;
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
      const variantId = url.searchParams.get('variantId'); // Get the variantId from the query params
  
      console.log("Product ID to delete:", productId);
      console.log("Variant ID to delete:", variantId);
  
      if (!productId) {
        console.error("Product ID is missing");
        return new Response(JSON.stringify({ message: "productId is required" }), { status: 400 });
      }
  
      if (variantId) {
        // Delete only the specified variant by setting its quantity to 0
        await sql`
          UPDATE productvariant
          SET quantity = 0
          WHERE product_id = ${productId} AND variant_id = ${variantId};`;
        return new Response(JSON.stringify({ message: "Variant deleted successfully" }), { status: 200 });
      } else {
        // Delete the entire product by setting the quantity to 0 for all variants
        await sql`
          UPDATE productvariant
          SET quantity = 0
          WHERE product_id = ${productId};`;
        return new Response(JSON.stringify({ message: "Product soft deleted successfully" }), { status: 200 });
      }
  
    } catch (error) {
      console.error('An error occurred: Internal server error', error);
      console.error('Error details:', error);
      return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
    }
  }
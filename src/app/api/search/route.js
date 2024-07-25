import { neon } from '@neondatabase/serverless';

export const dynamic  = 'force-dynamic';
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const term = searchParams.get('term') || '';

    if (!term) {
      return new Response(JSON.stringify({ message: "Search term is required" }), { status: 400 });
    }

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const products = await sql`
      SELECT p.product_id,
       p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, 
             yp.yarn_material, fp.fabric_print_tech, fp.fabric_material
      FROM Products p 
      LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id 
      LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id
      WHERE p.product_name ILIKE ${'%' + term + '%'} 
         OR p.product_description ILIKE ${'%' + term + '%'} OR yp.yarn_material ILIKE ${'%' + term + '%'} OR fp.fabric_print_tech ILIKE ${'%' + term + '%'} OR fp.fabric_material ILIKE ${'%' + term + '%'} OR p.product_type ILIKE ${'%' + term + '%'}
      GROUP BY p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, 
               yp.yarn_material, fp.fabric_print_tech, fp.fabric_material;
    `;

    if (products.length === 0) {
      return new Response(JSON.stringify({ message: "No products found" }), { status: 404 });
    }

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('An error occurred: Internal server error', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

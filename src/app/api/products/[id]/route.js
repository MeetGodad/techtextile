import { neon } from "@neondatabase/serverless";


export async function GET(req, { params }) {  
    const id = params.id;
    console.log("User ID:", id);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const Products = await sql `SELECT p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, yp.yarn_material, fp.fabric_print_tech, fp.fabric_material, STRING_AGG(DISTINCT pv.variant_name || ': ' || pv.variant_value, ', ') AS variants, s.business_name AS seller_business_name, s.phone_num AS seller_phone_num, s.business_address AS seller_business_address 
    FROM Products p LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id LEFT JOIN Sellers s ON p.seller_id = s.seller_id
    WHERE p.product_id = ${id}
    GROUP BY p.product_id, p.product_name, p.product_description, p.price, p.image_url, p.seller_id, p.product_type, yp.yarn_material, fp.fabric_print_tech, fp.fabric_material, s.user_id,  s.business_name, s.phone_num, s.business_address`;

    if (Products.length === 0) {
        return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(Products), { status: 200 });

}
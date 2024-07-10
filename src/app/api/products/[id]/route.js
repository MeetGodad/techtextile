import { neon } from "@neondatabase/serverless";

export async function GET(req, { params }) {  
    const id = params.id;
    console.log("User ID:", id);

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);
    const Products = await sql `
   SELECT 
    p.product_id, 
    p.product_name, 
    p.product_description, 
    p.price, 
    p.image_url, 
    p.seller_id, 
    p.product_type, 
    yp.yarn_material, 
    fp.fabric_print_tech, 
    fp.fabric_material, 
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'variant_id', pv.variant_id,
                'color', split_part(pv.variant_attributes, ', ', 1),
                'denier', split_part(pv.variant_attributes, ', ', 2),
                'quantity', pv.quantity
            )
        )
        FROM ProductVariant pv
        WHERE pv.product_id = p.product_id
    ) AS variants,
    s.business_name AS seller_business_name, 
    s.phone_num AS seller_phone_num, 
    jsonb_build_object(
        'street', a.street,
        'city', a.city,
        'state', a.state,
        'postal_code', a.postal_code
    ) AS seller_address
FROM 
    Products p 
    LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id 
    LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id 
    LEFT JOIN Sellers s ON p.seller_id = s.seller_id
    LEFT JOIN Addresses a ON s.business_address = a.address_id
WHERE 
    p.product_id = ${id}
GROUP BY 
    p.product_id, 
    p.product_name, 
    p.product_description, 
    p.price, 
    p.image_url, 
    p.seller_id, 
    p.product_type, 
    yp.yarn_material, 
    fp.fabric_print_tech, 
    fp.fabric_material, 
    s.business_name, 
    s.phone_num, 
    a.street,
    a.city,
    a.state,
    a.postal_code;`;

    if (Products.length === 0) {
        return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(Products), { status: 200 });

}
//https://github.com/vercel/next.js/issues/51788  :- for caching issue


import { neon } from "@neondatabase/serverless";

export const fetchCache = 'force-no-store'
export const revalidate = 0 // seconds
export const dynamic = 'force-dynamic'
export async function GET(req, { params }) {  
    try {
    const user_id = params.id;
    const id = user_id
    

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
    ) AS seller_address,
    pr.average_rating,
    pr.total_reviews
FROM 
    Products p 
    LEFT JOIN YarnProducts yp ON p.product_id = yp.product_id 
    LEFT JOIN FabricProducts fp ON p.product_id = fp.product_id 
    LEFT JOIN Sellers s ON p.seller_id = s.seller_id
    LEFT JOIN Addresses a ON s.business_address = a.address_id
    LEFT JOIN product_ratings pr ON p.product_id = pr.product_id
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
    a.postal_code,
    pr.average_rating,
    pr.total_reviews;`;
  if (Products.length === 0) {
            return new Response(JSON.stringify({ message: "Product not found" }), {
                status: 404,
                next: '/products',
                headers: {
                'Cache-Control': fetchCache,
                'Content-Type': 'application/json'
            }
            });
        }

        return new Response(JSON.stringify(Products), {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error('An error occurred:', error.message);
        console.error('Stack trace:', error.stack);
        return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), {
            status: 500,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    }
}

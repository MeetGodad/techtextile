import { neon } from '@neondatabase/serverless';


export const fetchCache = 'force-no-store'
export const revalidate = 0 // seconds
export const dynamic = 'force-dynamic'

export async function GET(req, { params }) {
  const userId = params.id;
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
      const orders = await sql`
         WITH OrderItemsAggregated AS (
    SELECT 
        oi.order_id,
        json_agg(
            DISTINCT jsonb_build_object(
                'order_item_id', oi.order_item_id,
                'product_id', p.product_id,
                'product_name', p.product_name,
                'product_type', p.product_type,
                'price', p.price,
                'quantity', oi.quantity,
                'item_price', oi.item_price,
                'image_url', p.image_url,
                'variant_id', oi.variant_id,
                'variant_attributes', pv.variant_attributes,
                'item_status', oi.item_status,
                'cancellation_reason', oic.cancellation_reason,
                'canceled_at', oic.canceled_at,
                'seller_address', jsonb_build_object(
                    'address_id', sa.address_id,
                    'street', sa.street,
                    'city', sa.city,
                    'state', sa.state,
                    'postal_code', sa.postal_code,
                    'country', sa.country
                )
            )
        ) AS order_items
    FROM 
        OrderItems oi
    JOIN 
        Products p ON oi.product_id = p.product_id
    LEFT JOIN 
        YarnProducts yp ON p.product_id = yp.product_id
    LEFT JOIN 
        FabricProducts fp ON p.product_id = fp.product_id
    LEFT JOIN 
        ProductVariant pv ON oi.variant_id = pv.variant_id
    LEFT JOIN
        OrderItemCancellations oic ON oi.order_item_id = oic.order_item_id
    LEFT JOIN
        Sellers s ON p.seller_id = s.seller_id
    LEFT JOIN
        Addresses sa ON s.business_address = sa.address_id
    GROUP BY 
        oi.order_id
)
SELECT
    o.order_id,
    o.order_status,
    o.payment_status_check AS payment_status,
    o.order_total_price,
    o.order_shhipping_cost AS order_shipping_cost,
    o.created_at,
    CASE 
        WHEN o.order_status IN ('pending', 'confirmed') THEN true
        ELSE false
    END AS can_cancel,
    oc.cancellation_reason AS order_cancellation_reason,
    oia.order_items,
    jsonb_build_object(
        'address_id', a.address_id,
        'address_first_name', a.address_first_name,
        'address_last_name', a.address_last_name,
        'street', a.street,
        'city', a.city,
        'state', a.state,
        'postal_code', a.postal_code,
        'country', a.country
    ) AS shipping_address
FROM 
    Orders o
LEFT JOIN
    OrderItemsAggregated oia ON o.order_id = oia.order_id
LEFT JOIN
    OrderCancellations oc ON o.order_id = oc.order_id
LEFT JOIN
    Addresses a ON o.shipping_address_id = a.address_id
WHERE 
    o.user_id = ${userId}
ORDER BY 
    o.created_at DESC;
          `;

    if (orders.length ===0 ) {
      return new Response(JSON.stringify({ message: "No orders found" }), 
      { status : 400 });
      

    }

    return new Response(JSON.stringify(orders), 
    { status: 200 });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), { status: 500 });
  }
}

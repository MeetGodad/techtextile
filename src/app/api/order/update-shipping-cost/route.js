import {neon} from '@neondatabase/serverless';


export async function POST(request) {
    const {orderId , newShippingCost} = await request.json();
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);


    try {
        const result = await sql`
          UPDATE orders
            SET 
               order_shhipping_cost = ${newShippingCost}::DECIMAL(10,2),
                order_total_price = (
                    COALESCE(order_total_price, 0) - COALESCE(order_shhipping_cost, 0) + $1::DECIMAL(10,2)
                )
            WHERE order_id = ${orderId}
            RETURNING *;
        `;
        if (result.length === 0) {
            return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(result[0]), { status: 200 });
    } catch (error) {   
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

import { neon } from '@neondatabase/serverless';

export async function POST(request) {
    const { orderId, userId, cancellationReason } = await request.json();
    console.log(orderId, userId, cancellationReason);
    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    try {
        // Start a transaction
        const result = await sql.transaction([
            sql`
                UPDATE Orders
                SET order_status = 'canceled'
                WHERE order_id = ${orderId} AND user_id = ${userId}
                RETURNING *
            `,

            sql`
                INSERT INTO OrderCancellations (order_id, canceled_by, cancellation_reason)
                VALUES (${orderId}, ${userId}, ${cancellationReason})
            `,

            sql`
                UPDATE Orders
                SET payment_status_check = 'refunded'
                WHERE order_id = ${orderId} AND payment_status_check = 'confirmed' 
            `,

            sql`
                UPDATE OrderItems
                SET item_status = 'canceled'
                WHERE order_id = ${orderId}
            `,

            sql`
              INSERT INTO OrderItemCancellations (order_item_id, canceled_by, cancellation_reason)
                SELECT order_item_id, ${userId}, ${cancellationReason} || ' - Due to order cancellation'
                FROM OrderItems
                WHERE order_id = ${orderId}
            `,

            sql`
                UPDATE ProductVariant pv
                SET quantity = pv.quantity + oi.quantity
                FROM OrderItems oi
                WHERE oi.order_id = ${orderId}
                AND oi.variant_id = pv.variant_id
            `,

            sql`
                UPDATE ShippingDetails
                SET status = 'canceled'
                WHERE order_id = ${orderId}
            `
        ]);

        const updatedOrder = result[0];
        if (updatedOrder.length === 0) {
            throw new Error('Order not found or user not authorized');
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Order cancelled successfully' }),
            { headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error cancelling order:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Failed to cancel order', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
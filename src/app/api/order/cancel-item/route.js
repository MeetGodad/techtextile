import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  const { orderItemId, userId, cancellationReason } = await request.json();
  console.log(orderItemId, userId, cancellationReason);
  const databaseUrl = process.env.DATABASE_URL;
  const sql = neon(databaseUrl);

  try {
    const result = await sql.transaction((tx) => [
      tx`
        UPDATE OrderItems
        SET item_status = 'canceled'
        WHERE order_item_id = ${orderItemId}
        RETURNING *
      `,

      tx`
        INSERT INTO OrderItemCancellations (order_item_id, canceled_by, cancellation_reason)
        VALUES (${orderItemId}, ${userId}, ${cancellationReason})
        RETURNING *
      `,

    //   tx`
    //   UPDATE Orders o
    // SET order_total_price = GREATEST(0, (
    //     (SELECT order_total_price FROM Orders WHERE order_id = o.order_id) - 
    //     (SELECT item_price * quantity FROM OrderItems WHERE order_item_id = ${orderItemId})
    // ))
    // WHERE order_id = (SELECT order_id FROM OrderItems WHERE order_item_id = ${orderItemId})
    // RETURNING *
    //   `
    ]);

    console.log('Transaction results:', JSON.stringify(result, null, 2));

    return new Response(JSON.stringify({ success: true, result }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database operation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Database operation failed',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

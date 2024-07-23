import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  const { orderId, newShippingCost } = await request.json();
  console.log('Updating order:', orderId, 'with new shipping cost:', newShippingCost);
  const databaseUrl = process.env.DATABASE_URL || "";
  const sql = neon(databaseUrl);

  try {
    const result = await sql`
      WITH existing_order AS (
        SELECT order_id, current_shipping_cost, current_total_price
        FROM Orders
        WHERE order_id = ${orderId}
      ), updated_order AS (
        UPDATE Orders
        SET current_shipping_cost = ${newShippingCost}::DECIMAL(10,2)
        WHERE order_id = ${orderId}
        RETURNING *
      )
      SELECT 
        (SELECT row_to_json(existing_order) FROM existing_order) AS old_values,
        (SELECT row_to_json(updated_order) FROM updated_order) AS new_values
    `;

    if (result.length === 0 || !result[0].old_values) {
      throw new Error("Order not found");
    }

    const { old_values: existingOrder, new_values: updatedOrder } = result[0];

    console.log('Update result:', { oldValues: existingOrder, newValues: updatedOrder });
    return new Response(JSON.stringify({
      success: true,
      message: "Shipping cost updated successfully",
      data: { oldValues: existingOrder, newValues: updatedOrder }
    }), { status: 200 });

  } catch (error) {
    console.error('Error updating shipping cost:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), { status: error.message === "Order not found" ? 404 : 500 });
  }
}
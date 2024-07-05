import { neon } from "@neondatabase/serverless";

export async function POST(request) {
  try {
    const requestData = await request.json();
    const { orderId, paymentMethod, paymentAmount } = requestData;

    const databaseUrl = process.env.DATABASE_URL || "";
    const sql = neon(databaseUrl);

    const paymentInfo = await sql`
      INSERT INTO payments (order_id, payment_method, payment_amount)
      VALUES (${orderId}, ${paymentMethod}, ${paymentAmount})
      RETURNING *;
    `;

    return new Response(JSON.stringify(paymentInfo[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process payment',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
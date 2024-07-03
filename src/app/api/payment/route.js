// Import necessary modules
import { neon } from '@neondatabase/serverless';

// Function to handle POST request
export async function postPayment(req, res) {
  const { orderId, paymentMethod, paymentAmount } = req.body;

  try {
    // Connect to Neon database
    const databaseUrl = process.env.DATABASE_URL || '';
    const sql = neon(databaseUrl);

    // Insert payment information into 'payments' table
    const paymentInfo = await sql`
      INSERT INTO payments (order_id, payment_method, payment_amount)
      VALUES (${orderId}, ${paymentMethod}, ${paymentAmount})
      RETURNING *;
    `;

    // Return success response with the saved payment information
    res.status(200).json(paymentInfo[0]);
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Return error response with HTTP 500 status
    res.status(500).json({ error: 'Failed to process payment' });
  }
}

// Export the POST handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    await postPayment(req, res);
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

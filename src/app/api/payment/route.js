// pages/api/process-payment.js
import { neon } from "@neondatabase/serverless";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { orderId, paymentMethod, totalPrice } = await request.json();
    
    console.log('Received payment request:', { orderId, paymentMethod, totalPrice });

    if (!totalPrice) {
      throw new Error('Payment amount is missing');
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // This should be in cents
      currency: 'cad',
      payment_method: paymentMethod,
      confirm: true,
      // Add the following line to specify automatic payment methods
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      // Alternatively, if you want to allow redirects, use this instead:
      // return_url: 'https://your-website.com/payment-success',
    });

    console.log('PaymentIntent created:', paymentIntent);

    if (paymentIntent.status === 'succeeded') {
      const databaseUrl = process.env.DATABASE_URL || "";
      const sql = neon(databaseUrl);

      // Store payment information in the database
      const paymentInfo = await sql`
        INSERT INTO payments (
          order_id, 
          payment_method, 
          payment_amount, 
          payment_date, 
          stripe_payment_intent_id
        )
        VALUES (
          ${orderId}, 
          ${paymentMethod}, 
          ${totalPrice},
          ${new Date().toISOString()},
          ${paymentIntent.id}
        )
        RETURNING *;
      `;

      // Update order status to 'paid'
      await sql`
      UPDATE orders
      SET 
        order_status = 'confirmed',
        payment_status_check = 'confirmed'
      WHERE order_id = ${orderId};
      `;

      return new Response(JSON.stringify({
        paymentInfo: paymentInfo[0],
        stripeClientSecret: paymentIntent.client_secret
      }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process payment',
      details: error.message
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
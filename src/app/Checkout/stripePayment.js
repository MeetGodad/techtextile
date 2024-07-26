// References
// ChatGpt: https://chatgpt.com/c/fd190831-d95b-42ba-9f37-2847b4796d64
// Styling: https://www.w3schools.com/react/react_css_styling.asp
// CSS: https://tailwindcss.com/docs/installation
// Stripe: https://dashboard.stripe.com/test/apikeys
// Next.js: https://nextjs.org/learn/dashboard-app

"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripeFormContent = ({ orderId, totalPrice, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements || !totalPrice) {
      setError('Unable to process payment. Please try again.');
      setProcessing(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card Element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          paymentMethod: paymentMethod.id, 
          totalPrice: totalPrice
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        const { stripeClientSecret } = result;
        const { error: confirmError } = await stripe.confirmCardPayment(stripeClientSecret);
        
        if (confirmError) {
          setError(confirmError.message);
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again.');
    }

    setProcessing(false);
  };
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
          Card details
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <CardElement
            id="card-element"
            options={cardElementOptions}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-600 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing || !totalPrice}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay $${totalPrice ? totalPrice.toFixed(2): '0.00'}`}
      </button>
    </form>
  );
};

const StripeForm = (props) => (
  <Elements stripe={stripePromise}>
    <StripeFormContent {...props} />
  </Elements>
);

export default StripeForm;
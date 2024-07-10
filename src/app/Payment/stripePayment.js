"use client";
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PYzD4I0SV7v42YRlv2PVnxZi463GkpfZioFf6cwPH2GFcQ6o8a5NaskRcEfOugxQTFjt7BHU3ETfIAXEQk1F1lt003eyk2j27');

const PaymentForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'John Doe', // Replace with the actual billing name
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else {
        // Handle successful payment
        alert('Payment successful!');
        setIsProcessing(false);
      }
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {errorMessage && <div>{errorMessage}</div>}
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

const StripePaymentPage = ({ orderId, amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm orderId={orderId} amount={amount} />
    </Elements>
  );
};

export default StripePaymentPage;

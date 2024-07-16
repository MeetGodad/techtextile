import React from 'react';
import StripePaymentPage from './stripePayment'; // Adjust the path as necessary

const OrderPage = () => {
  const orderId = orderId;
  const amount = paymentAmount;

  return (
    <div>
      <h1>Complete Your Payment</h1>
      <StripePaymentPage orderId={orderId} amount={amount} />
    </div>
  );
};

export default OrderPage;

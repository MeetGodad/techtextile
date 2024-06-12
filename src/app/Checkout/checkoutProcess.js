"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Checkout = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);
    }
  }, []);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    validateStep1();
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    validateStep2();
  };

  const validateStep1 = () => {
    const { firstName, lastName, address, city, state, zip, email } = shippingInfo;
    setIsStepValid(firstName && lastName && address && city && state && zip && email);
  };

  const validateStep2 = () => {
    const { cardName, cardNumber, expiryDate, cvv } = paymentInfo;
    setIsStepValid(cardName && cardNumber && expiryDate && cvv);
  };

  const handleNextStep = () => {
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle form submission, e.g., send data to server
    alert('Order Submitted');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={shippingInfo.firstName}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={shippingInfo.lastName}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingInfo.state}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={shippingInfo.zip}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </form>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="cardName"
                placeholder="Name on Card"
                value={paymentInfo.cardName}
                onChange={handlePaymentChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </form>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Review Order</h2>
            <div className="bg-white p-4 rounded shadow-md">
              {cart.map((item) => (
                <div key={item.product_id} className="flex items-center mb-4">
                  <img src={item.image_url} alt={item.product_name} className="w-16 h-16 rounded mr-4" />
                  <div>
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${Number(item.price).toFixed(2)}</p>
                    <p>Subtotal: ${Number(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-semibold mt-4">
                <span>Total</span>
                <span>${Number(cart.reduce((total, item) => total + item.price * item.quantity, 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    return (
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button onClick={handlePreviousStep} className="px-4 py-2 bg-gray-300 rounded">
            Previous
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNextStep}
            disabled={!isStepValid}
            className={`px-4 py-2 ${isStepValid ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded`}
          >
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
            Place Order
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded">
      <div className="flex">
        <div className="flex-1 mr-8">
          {renderStep()}
        </div>
        <div className="flex-1 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.product_id} className="flex items-center mb-4">
              <img src={item.image_url} alt={item.product_name} className="w-16 h-16 rounded mr-4" />
              <div>
                <h3 className="font-semibold">{item.product_name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${Number(item.price).toFixed(2)}</p>
                <p>Subtotal: ${Number(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>${Number(cart.reduce((total, item) => total + item.price * item.quantity, 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>
      {renderButtons()}
    </div>
  );
};

export default Checkout;

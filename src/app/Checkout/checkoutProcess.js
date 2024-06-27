"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';

const Checkout = () => {
  const router = useRouter();
  const { user } = useUserAuth();
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
    expirationDate: '',
    cvv: '',
    paypalEmail: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Visa');
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems(user.uid, step);
    }
  }, [user, step]);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      } else {
        console.error('Failed to fetch cart items:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

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

  const handleExpirationDateChange = (value) => {
    setPaymentInfo((prev) => ({ ...prev, expirationDate: value }));
    validateStep2();
  };

  const validateStep1 = () => {
    const { firstName, lastName, address, city, state, zip, email } = shippingInfo;
    setIsStepValid(firstName && lastName && address && city && state && zip && email);
  };

  const validateStep2 = () => {
    if (selectedPaymentMethod === 'PayPal') {
      setIsStepValid(paymentInfo.paypalEmail !== '');
    } else {
      const { cardName, cardNumber, expirationDate, cvv } = paymentInfo;
      setIsStepValid(cardName && cardNumber && expirationDate && cvv);
    }
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
    alert('Order Submitted');
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'Visa':
      case 'Mastercard':
        return (
          <div className="space-y-4">
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
                id="expirationDate"
                pattern="[0-9]{2}/[0-9]{2}"
                placeholder="MM/YY"
                value={paymentInfo.expirationDate}
                onChange={(e) => handleExpirationDateChange(e.target.value)}
                name="expirationDate"
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
          </div>
        );
      case 'PayPal':
        return (
          <div className="space-y-4">
            <input
              type="email"
              name="paypalEmail"
              placeholder="PayPal Email"
              value={paymentInfo.paypalEmail}
              onChange={handlePaymentChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        );
      default:
        return null;
    }
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
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('Visa')}
                className={`p-2 border rounded ${selectedPaymentMethod === 'Visa' ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <img src="/Images/visa.png" alt="Visa" className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('Mastercard')}
                className={`p-2 border rounded ${selectedPaymentMethod === 'Mastercard' ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <img src="/Images/mastercard.png" alt="Mastercard" className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('PayPal')}
                className={`p-2 border rounded ${selectedPaymentMethod === 'PayPal' ? 'border-blue-500' : 'border-gray-300'}`}
              >
                <img src="/Images/paypal.png" alt="PayPal" className="w-8 h-8" />
              </button>
            </div>
            <form className="space-y-4">
              {renderPaymentForm()}
            </form>
          </div>
        );
      case 3:
        const maskedCardNumber = `${paymentInfo.cardNumber.slice(0, 4)} **** **** ${paymentInfo.cardNumber.slice(-4)}`;
        const paymentEmail = paymentInfo.paypalEmail;
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Review Order</h2>
            <div className="bg-white p-4 rounded shadow-md space-y-4">
              <div>
                <h3 className="font-semibold">Shipping Information</h3>
                <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                <p>{shippingInfo.email}</p>
              </div>
              <div>
                <h3 className="font-semibold">Payment Information</h3>
                {selectedPaymentMethod === 'Visa' && (
                  <p>Card Number: {maskedCardNumber}</p>
                )}
                {selectedPaymentMethod === 'Mastercard' && (
                  <p>Card Number: {maskedCardNumber}</p>
                )}
                {selectedPaymentMethod === 'PayPal' && (
                  <p>PayPal Email: {paymentEmail}</p>
                )}
              </div>
              <div>
              <h3 className="font-semibold">Cart Items</h3>
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <img src={item.image_url} alt={item.product_name} className="w-16 h-16 object-cover" />
                      <div>
                        <p>{item.product_name}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div>
                      <p>${(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items in cart</p>
              )}
            </div>
            <div className="flex justify-between font-semibold">
              <p>Total</p>
              <p>${cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Step {step}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${(step / 3) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
          ></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            Back
          </button>
          {step > 1 && (
            <button
              onClick={handlePreviousStep}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          {step < 3 && (
            <button
              onClick={handleNextStep}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${isStepValid ? 'hover:bg-blue-600' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!isStepValid}
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Pay ${cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2)}
            </button>
          )}
        </div>
        <div className="border-t border-gray-300 pt-6">{renderStep()}</div>
      </div>
    </div>
  );
};

export default Checkout;

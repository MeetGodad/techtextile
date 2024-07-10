"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
import ShippingRateCalculator from '../ShippingRatesCalculation/ShippinhRates';
import AddressInput from '../components/AddressInput';
import { count } from 'firebase/firestore';

const Checkout = () => {
  const router = useRouter();
  const { user } = useUserAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    countryCode: '',
    stateCode: '',
    email: '',
    phone: '',
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
  const [totalShippingCost, setTotalShippingCost] = useState(0);

  const handleTotalShippingCostChange = (cost) => {
    setTotalShippingCost(cost);
  };

  const subTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalPrice = subTotalPrice + totalShippingCost;




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
    const { firstName, lastName, street, city, state, zip, email } = shippingInfo;
    setIsStepValid(firstName && lastName && street && city && state && zip && email);
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

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          countryCode: shippingInfo.countryCode,
          email: shippingInfo.email,
          selectedPaymentMethod,
          cart,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Order Submitted');
        return data.orderId;
      } else {
        console.error('Failed to submit order:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      return null;
    }
  };
  const handlePayment = async (orderId) => {
    const orderTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentMethod: selectedPaymentMethod,
          paymentAmount: orderTotalPrice,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Payment Submitted');
      } else {
        console.error('Failed to submit payment:', data.error);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };
  const handlePayAndSubmit = async () => {
    const orderId = await handleSubmit();
    if (orderId) {
      await handlePayment(orderId);
    } else {
      alert('Failed to create order. Please try again.');
    }
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
          <div className="animate-fade-in-down">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Details</h2>
            <form className="space-y-6 bg-white  text-gray-800 p-6 rounded-lg shadow-md">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              <AddressInput
                role="shipping"
                street={shippingInfo.street}
                city={shippingInfo.city}
                state={shippingInfo.state}
                postalCode={shippingInfo.zip}
                country={shippingInfo.countryCode}
                setStreet={(value) => setShippingInfo(prev => ({ ...prev, street: value }))}
                setCity={(value) => setShippingInfo(prev => ({ ...prev, city: value }))}
                setState={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                setPostalCode={(value) => setShippingInfo(prev => ({ ...prev, zip: value }))}
                setStateCode={(value) => setShippingInfo(prev => ({ ...prev, stateCode: value }))}
                setCountryCode={(value) => setShippingInfo(prev => ({ ...prev, countryCode: value }))}
    />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input 
                type="tel"
                name="phone"
                placeholder="Phone Number"
                pattern="[0-9]{10}"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </form>
          </div>
        );
        case 2:
          return (
            <div className="animate-fade-in-down">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Payment Method</h2>
              <div className="flex flex-wrap gap-4 mb-8">
                {['Visa', 'Mastercard', 'PayPal'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`p-4 border-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      selectedPaymentMethod === method
                        ? 'border-black bg-gray-100 shadow-md'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={`/Images/${method.toLowerCase()}.png`}
                      alt={method}
                      className="w-12 h-12 object-contain"
                      onError={() => console.log(`Failed to load image: /Images/${method.toLowerCase()}.png`)}
                    />
                    <p className="mt-2 text-sm font-semibold text-gray-700">{method}</p>
                  </button>
                ))}
              </div>

              <form className="space-y-6 bg-white  text-gray-800 p-6 rounded-lg shadow-md animate-fade-in">
                {renderPaymentForm()}
              </form>
            </div>
          );
      case 3:
        const maskedCardNumber = `${paymentInfo.cardNumber.slice(0, 4)} **** **** ${paymentInfo.cardNumber.slice(-4)}`;
        const paymentEmail = paymentInfo.paypalEmail;
        return (
          <div className="animate-fade-in-down">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Review Your Order</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-4 rounded-md transition-all duration-300 hover:shadow-md">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Shipping Information</h3>
                  <p className="text-gray-700 break-words">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p className="text-gray-700 break-words">{shippingInfo.address}</p>
                  <p className="text-gray-700 break-words">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                  <p className="text-gray-700 break-words">{shippingInfo.email}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-md transition-all duration-300 hover:shadow-md">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Payment Information</h3>
                  {selectedPaymentMethod === 'Visa' && (
                    <p className="text-gray-700">Visa Card: {maskedCardNumber}</p>
                  )}
                  {selectedPaymentMethod === 'Mastercard' && (
                    <p className="text-gray-700">Mastercard: {maskedCardNumber}</p>
                  )}
                  {selectedPaymentMethod === 'PayPal' && (
                    <p className="text-gray-700 break-words">PayPal Email: {paymentEmail}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-blue-700">Cart Items</h3>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-4 transition-all duration-300 hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                        <img src={item.image_url.split(',')[[0]]} alt={item.product_name} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                          <div>
                            <p className="font-semibold text-gray-800">{item.product_name}</p>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-600">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                ) : (
                  <p className="text-gray-500 italic">No items in cart</p>
                )}
              </div>
              <div className="flex justify-between font-bold text-black text-lg border-t pt-4">  
              <ShippingRateCalculator 
                  cartItems={cart} 
                  buyerAddress={{
                    firstName: shippingInfo.firstName,
                    lastName: shippingInfo.lastName,
                    address: shippingInfo.street,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    zip: shippingInfo.zip,
                    country: shippingInfo.countryCode,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone,
                  }}
                  onTotalShippingCostChange={handleTotalShippingCostChange}
                />
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <p className="text-gray-800">Total</p>
                <p className="text-blue-700">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md animate-fade-in-down">
        <div className="relative mb-8">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-sm font-bold inline-block py-1 px-3 rounded-full text-black bg-gray-200 uppercase tracking-wide">
                Step {step} of 3
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${(step / 3) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="animate-fade-in">
            {renderStep()}
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-gray-300">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300 transform hover:scale-105"
            >
              Back to Cart
            </button>
            <div className="space-x-4">
              {step > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  Previous
                </button>
              )}
              {step < 3 && (
                <button
                  onClick={handleNextStep}
                  className={`bg-black text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                    isStepValid ? 'hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!isStepValid}
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button
                  onClick={handlePayAndSubmit}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 animate-pulse"
                >
                  Pay ${totalPrice.toFixed(2)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

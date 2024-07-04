"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
<<<<<<< Updated upstream
import { sendOrderEmail } from '../email/Mailgun';
=======
import { sendOrderConfirmationEmails } from './emailService';

>>>>>>> Stashed changes

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
      fetchCartItems(user.uid);
    }
  }, [user]);

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

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleNextStep = () => {
    if (isStepValid) {
      setStep(step + 1);
    }
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
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
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
          orderId,
          paymentMethod: selectedPaymentMethod,
          paymentAmount: orderTotalPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Payment Submitted');
        return { orderId, detailedCart: cart, orderTotalPrice }; // Return detailed response
      } else {
        console.error('Failed to submit payment:', data.error);
        return null; // Indicate payment failure
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      return null; // Indicate payment failure
    }
  };

<<<<<<< Updated upstream
  const handlePayAndSubmit = async () => {
    try {
      const orderId = await handleSubmit();

      if (orderId) {
        const paymentResponse = await handlePayment(orderId);

        if (paymentResponse) {
          const { detailedCart, orderTotalPrice } = paymentResponse;

          const emailData = {
            shippingInfo,
            paymentInfo: { selectedPaymentMethod },
            cart: detailedCart,
            totalAmount: orderTotalPrice,
          };

          try {
            const response = await fetch('/api/email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: 'techtextile@gmail.com',
                subject: 'Order Confirmation',
                body: `
                  <h1>Order Confirmation</h1>
                  <p>Thank you for your order!</p>
                  <p>Total Amount: ${orderTotalPrice}</p>
                  <!-- Add more detailed email content here -->
                `,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Email API error: ${errorData.message}`);
            }

            console.log('Order confirmation email sent successfully');
          } catch (error) {
            console.error('Failed to send order confirmation email:', error);
            // Handle the error appropriately (e.g., display an error message to the user)
          }
        }
      }
    } catch (error) {
      console.error('Failed to complete order:', error);
      // Handle the error appropriately (e.g., display an error message to the user)
    }
  };
  
  const renderPaymentForm = () => {
    const inputClass = "w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300";
=======

>>>>>>> Stashed changes
  
  
const handlePayAndSubmit = async () => {
  const orderId = await handleSubmit();
  if (orderId) {
    await handlePayment(orderId);
    const orderDetails = {
      userId: user.uid,
      orderId: orderId,
      shippingInfo,
      cart,
      selectedPaymentMethod,
      totalPrice: cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2),
      paymentInfo: selectedPaymentMethod === 'PayPal' ? paymentInfo.paypalEmail : `${paymentInfo.cardNumber.slice(0, 4)} **** **** ${paymentInfo.cardNumber.slice(-4)}`,
    };
    const emailsSent = await sendOrderConfirmationEmails(orderDetails);

    if (emailsSent) {
      console.log('Order confirmation emails sent successfully');
      // Handle successful email sending (e.g., show a success message)
    } else {
      console.error('Failed to send order confirmation emails');
      // Handle email sending failure (e.g., show an error message)
    }

  } else {
    alert('Failed to create order. Please try again.');
  }
};

  
  
const renderPaymentForm = () => {
  const inputClass = "w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  switch (selectedPaymentMethod) {
    case 'Visa':
    case 'Mastercard':
      return (
        <div className="space-y-6 animate-fade-in-up">
          <div className="relative">
            <label htmlFor="cardName" className={labelClass}>Name on Card</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={paymentInfo.cardName}
              onChange={handlePaymentChange}
              className={`${inputClass} pl-10`}
            />
            <span className="absolute left-3 top-9 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <div className="relative">
            <label htmlFor="cardNumber" className={labelClass}>Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentChange}
              className={`${inputClass} pl-10`}
            />
            <span className="absolute left-3 top-9 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="expirationDate" className={labelClass}>Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                pattern="[0-9]{2}/[0-9]{2}"
                placeholder="MM/YY"
                value={paymentInfo.expirationDate}
                onChange={(e) => handleExpirationDateChange(e.target.value)}
                className={`${inputClass} pl-10`}
              />
              <span className="absolute left-3 top-9 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="relative">
              <label htmlFor="cvv" className={labelClass}>CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                className={`${inputClass} pl-10`}
              />
              <span className="absolute left-3 top-9 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      );
    case 'PayPal':
      return (
        <div className="space-y-6 animate-fade-in-up">
          <div className="relative">
            <label htmlFor="paypalEmail" className={labelClass}>PayPal Email</label>
            <input
              type="email"
              id="paypalEmail"
              name="paypalEmail"
              placeholder="you@example.com"
              value={paymentInfo.paypalEmail}
              onChange={handlePaymentChange}
              className={`${inputClass} pl-10`}
            />
            <span className="absolute left-3 top-9 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
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
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Shipping Details</h2>
          <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
                <span className="absolute left-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
                <span className="absolute left-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
              />
              <span className="absolute left-3 top-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
                <span className="absolute left-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
                <span className="absolute left-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={shippingInfo.zip}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
                <span className="absolute left-3 top-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm2 5a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
              />
              <span className="absolute left-3 top-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
            </div>
          </form>
        </div>
      );
      case 2:
        return (
          <div className="animate-fade-in-down">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Choose Payment Method</h2>
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {['Visa', 'Mastercard', 'PayPal'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    selectedPaymentMethod === method
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={`/Images/${method.toLowerCase()}.png`}
                    alt={method}
                    className="w-16 h-16 object-contain mx-auto"
                    onError={() => console.log(`Failed to load image: /Images/${method.toLowerCase()}.png`)}
                  />
                  <p className="mt-4 text-lg font-semibold text-gray-700 text-center">{method}</p>
                </button>
              ))}
            </div>
  
            <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg animate-fade-in-up max-w-lg mx-auto">
              {renderPaymentForm()}
            </form>
          </div>
        );
        case 3:
          const maskedCardNumber = `${paymentInfo.cardNumber.slice(0, 4)} **** **** ${paymentInfo.cardNumber.slice(-4)}`;
          const paymentEmail = paymentInfo.paypalEmail;
          return (
            <div className="animate-fade-in-down max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Review Your Order</h2>
              <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Shipping Information</h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="break-words">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p className="break-words">{shippingInfo.address}</p>
                      <p className="break-words">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                      <p className="break-words">{shippingInfo.email}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Payment Information</h3>
                    <div className="space-y-2 text-gray-700">
                      {selectedPaymentMethod === 'Visa' && (
                        <p>Visa Card: {maskedCardNumber}</p>
                      )}
                      {selectedPaymentMethod === 'Mastercard' && (
                        <p>Mastercard: {maskedCardNumber}</p>
                      )}
                      {selectedPaymentMethod === 'PayPal' && (
                        <p className="break-words">PayPal Email: {paymentEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="animate-fade-in-up">
                  <h3 className="font-bold text-xl mb-6 text-blue-700">Cart Items</h3>
                  {cart.length > 0 ? (
                    <div className="space-y-6">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-6 transition-all duration-300 hover:bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-6">
                            <img src={item.image_url.split(',')[0]} alt={item.product_name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                            <div>
                              <p className="font-semibold text-lg text-gray-800 mb-2">{item.product_name}</p>
                              <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
                              {item.selected_variants && item.selected_variants.length > 0 && (
                                <div className="text-gray-600 space-y-1">
                                  {item.selected_variants.map(variant => (
                                    <div key={variant.variant_id} className="flex items-center">
                                      <span className="font-semibold mr-2">{variant.variant_name.toUpperCase()}:</span>
                                      {variant.variant_name.toLowerCase() === 'color' ? (
                                        <span className="flex items-center">
                                          <span style={{ display: 'inline-block', backgroundColor: variant.variant_value, width: '20px', height: '20px', borderRadius: '50%', marginRight: '8px' }}></span>
                                          {variant.variant_value}
                                        </span>
                                      ) : (
                                        <span>{variant.variant_value}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-xl text-blue-600">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">Your cart is empty.</p>
                  )}
                </div>
                <div className="flex justify-between font-bold text-xl border-t pt-6 mt-8">
                  <p className="text-gray-800">Total</p>
                  <p className="text-blue-700">${cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-12 bg-white p-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 ease-in-out">
        <div className="relative">
          <div className="flex mb-4 items-center justify-between">
            <span className="text-sm font-extrabold inline-block py-2 px-4 rounded-full text-white bg-black uppercase tracking-wider shadow-lg">
              Step {step} of 3
            </span>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${(step / 3) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-in-out"
            ></div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="animate-fade-in transform transition-all duration-500 ease-in-out">
            {renderStep()}
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-gray-300">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded-lg px-4 py-2"
            >
              Back to Cart
            </button>
            <div className="space-x-4">
              {step > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-lg"
                >
                  Previous
                </button>
              )}
              {step < 3 && (
                <button
                  onClick={handleNextStep}
                  className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg ${
                    isStepValid ? 'hover:from-blue-600 hover:to-purple-700' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!isStepValid}
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button
                  onClick={handlePayAndSubmit}
                  className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-full hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-lg animate-pulse"
                >
                  Pay ${cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2)}
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
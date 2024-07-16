// checkoutProcess.js

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';

const Checkout = () => {
  const router = useRouter();
  const { user } = useUserAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [signupAddress, setSignupAddress] = useState({});
  const [useSignupAddress, setUseSignupAddress] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [totalShippingCost, setTotalShippingCost] = useState(0);
  const [existingAddresses, setExistingAddresses] = useState([]);

  // Function to handle changes in total shipping cost
  const handleTotalShippingCostChange = (cost) => {
    setTotalShippingCost(cost);
  };

  // Calculate subtotal price based on cart items
  const subTotalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalPrice = subTotalPrice + totalShippingCost;

  // Fetch cart items and user's signup address on component mount
  useEffect(() => {
    if (user) {
      fetchCartItems(user.uid);
      fetchUserAddress(user.uid);
    }
  }, [user]);

  // Function to fetch cart items for the user
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

  // Function to fetch user's signup address
  const fetchUserAddress = async (userId) => {
    try {
      const response = await fetch(`/api/address/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSignupAddress(data[0]);
        setExistingAddresses(data); // Assuming you get an array of addresses and you need the first one
      } else {
        console.error('Failed to fetch address:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Handle checkbox change to use signup address for shipping
  const handleCheckboxChange = () => {
    setUseSignupAddress(!useSignupAddress);

    if (!useSignupAddress) {
      // Autofill shipping details with signup address
      setShippingInfo({
        firstName: signupAddress.address_first_name || '',
        lastName: signupAddress.address_last_name || '',
        street: signupAddress.street || '',
        city: signupAddress.city || '',
        state: signupAddress.state || '',
        zip: signupAddress.postal_code || '',
        country: signupAddress.country || '',
        email: signupAddress.address_email || '',
        phone: signupAddress.phone_num || '',
      });
    } else {
      // Clear shipping details if the checkbox is unchecked
      setShippingInfo({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        email: '',
        phone: '',
      });
    }
    validateStep1(); // Validate step after updating shipping info
  };

  // Handler for shipping info change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    validateStep();
  };

  // Handler for payment info change
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    validateStep2();
  };

  // Handler for expiration date change
  const handleExpirationDateChange = (value) => {
    setPaymentInfo((prev) => ({ ...prev, expirationDate: value }));
    validateStep2();
  };

  // Function to validate step 1 (shipping details)
  const validateStep1 = () => {
    const { firstName, lastName, street, city, state, zip, email } = shippingInfo;
    setIsStepValid(firstName && lastName && street && city && state && zip && email);
  };

  // Function to validate step 2 (payment details)
  const validateStep2 = () => {
    if (selectedPaymentMethod === 'PayPal') {
      setIsStepValid(paymentInfo.paypalEmail !== '');
    } else {
      const { cardName, cardNumber, expirationDate, cvv } = paymentInfo;
      setIsStepValid(cardName && cardNumber && expirationDate && cvv);
    }
  };

  // Handler to move to previous step
  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // Handler to move to next step if current step is valid
  const handleNextStep = () => {
    if (isStepValid) {
      setStep(step + 1);
    }
  };

  // Function to submit the order
  const handleSubmitOrder = async () => {
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
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          country: shippingInfo.country,
          email: shippingInfo.email,
          cart,
        }),
      });
      const data = await response.json();
      if (response.ok) {
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

  // Function to handle payment submission
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

  // Function to handle complete checkout process
  const handleCompleteCheckout = async () => {
    const orderId = await handleSubmitOrder();
    if (orderId) {
      const paymentResult = await handlePayment(orderId);
      if (paymentResult) {
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
          alert('Order and payment submitted successfully');
          // Handle successful email sending (e.g., show a success message, redirect to a success page)
        } else {
          console.error('Failed to send order confirmation emails');
          alert('Order submitted, but failed to send confirmation emails');
          // Handle email sending failure (e.g., show an error message)
        }

        alert("Order confirmation emails sent successfully");
      } else {
        alert('Payment failed. Please try again.');
      }
    } else {
      alert('Failed to create order. Please try again.');
    }
  };
  
  const handleAddressChange = (address) => {
    setShippingInfo(address);
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
          <div className="flex items-center">
              <input
                type="checkbox"
                id="useSignupAddress"
                name="useSignupAddress"
                checked={useSignupAddress}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <label htmlFor="useSignupAddress" className="ml-2 text-gray-700">
                Use the same address as signup address
              </label>
            </div> 
            <div>
                      <h2>Existing Addresses</h2>
                {existingAddresses.length > 0 ? (
                  <ul>
                    {existingAddresses.map((address) => (
                      <li key={address.address_id} onClick={() => handleAddressChange(address)}>
                       {address.address_id}, {address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country},
                       
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No existing addresses found.</p>
                )}
              </div>           
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={useSignupAddress ? shippingInfo.firstName : ''}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={useSignupAddress ? shippingInfo.lastName : ''}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
              </div>
            </div>
            <div className="relative">
            <AddressInput
                role="shipping"
                street={shippingInfo.street}
                city={shippingInfo.city}
                state={shippingInfo.state}
                postalCode={shippingInfo.zip}
                country={shippingInfo.country}
                setStreet={(value) => setShippingInfo(prev => ({ ...prev, street: value }))}
                setCity={(value) => setShippingInfo(prev => ({ ...prev, city: value }))}
                setState={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                setPostalCode={(value) => setShippingInfo(prev => ({ ...prev, zip: value }))}
                setStateCode={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                setCountry={(value) => setShippingInfo(prev => ({ ...prev, country: value }))}
                inputClassName="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                containerClassName="relative mb-4"
                iconClassName="absolute left-3 top-4 text-gray-400"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={useSignupAddress ? shippingInfo.email : ''}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  pattern="[0-9]{10}"
                  value={useSignupAddress ? shippingInfo.phone : ''}
                  onChange={handleShippingChange}
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
              </div>
            </div>
            {/* Checkbox to use signup address */}

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
                    street: shippingInfo.street,
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
    <div className="checkout-container">
      {step === 1 && (
        <div>
          <h2>Shipping Details</h2>
          <form>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleShippingChange} />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleShippingChange} />
            <input type="text" name="address" placeholder="Address" onChange={handleShippingChange} />
            <input type="text" name="city" placeholder="City" onChange={handleShippingChange} />
            <input type="text" name="state" placeholder="State" onChange={handleShippingChange} />
            <input type="text" name="zip" placeholder="ZIP" onChange={handleShippingChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleShippingChange} />
            <button type="button" onClick={() => setStep(2)} disabled={!isStepValid}>Review Order</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Review Your Order</h2>
          <div>
            <h3>Shipping Information</h3>
            <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.address}</p>
            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
            <p>{shippingInfo.email}</p>
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
                  onClick={handleCompleteCheckout}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 animate-pulse"
                >
                  Pay ${totalPrice.toFixed(2)}
                </button>
              )}
            </div>
          </div>
          <button type="button" onClick={() => setStep(1)}>Back</button>
          <button type="button" onClick={handlePayAndSubmit}>Submit and Pay</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

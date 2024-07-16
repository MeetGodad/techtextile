// checkoutProcess.js

"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
import ShippingRateCalculator from '../ShippingRatesCalculation/ShippinhRates';
import AddressInput from '../components/AddressInput';
import { count } from 'firebase/firestore';
import { sendOrderConfirmationEmails } from './emailService';

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
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: '',
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [totalShippingCost, setTotalShippingCost] = useState(0);
  const [shippingDetails, setShippingDetails] = useState([]);
  const [existingAddresses, setExistingAddresses] = useState([]);
  const handleShippingDetailsChange = (details) => {
    setShippingDetails(details);
  };
  

  const handleTotalShippingCostChange = (cost) => {
    setTotalShippingCost(cost);
  };

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
    validateStep1();
  };

  // Function to validate step 1 (shipping details)
  const validateStep1 = () => {
    const { firstName, lastName, street, city, state, zip, email } = shippingInfo;
    setIsStepValid(firstName && lastName && street && city && state && zip && email);
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
          shippingDetails,
          totalShippingCost: totalShippingCost.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
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

// Function to handle complete checkout process
const handleCompleteCheckout = async () => {
  const orderId = await handleSubmitOrder();
  if (orderId) {
    const orderDetails = {
      userId: user.uid,
      orderId: orderId,
      shippingInfo,
      cart,
      selectedPaymentMethod,
      totalShippingCost: totalShippingCost.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    };

    const emailsSent = await sendOrderConfirmationEmails(orderDetails);

    if (emailsSent) {
      console.log('Order confirmation emails sent successfully');
      alert('Order submitted successfully');
      // Handle successful email sending (e.g., show a success message, redirect to a success page)
    } else {
      console.error('Failed to send order confirmation emails');
      alert('Order submitted, but failed to send confirmation emails');
      // Handle email sending failure (e.g., show an error message)
    }
  } else {
    alert('Failed to create order. Please try again.');
  }
};

  const handleAddressChange = (address) => {
    setShippingInfo(address);
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

                  className="w-full p-4 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pl-10"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={useSignupAddress ? shippingInfo.lastName : ''}
                  onChange={handleShippingChange}

                  className="w-full p-3 border text-black border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                  onShippingDetailsChange={handleShippingDetailsChange}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-12 bg-white p-10 rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105">
        <div className="relative">
          <div className="flex mb-4 items-center justify-between">
            <span className="text-sm font-extrabold inline-block py-2 px-4 rounded-full text-white bg-black uppercase tracking-wider shadow-lg">
              Step {step} of 2
            </span>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${(step / 2) * 100}%` }}
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
              {step < 2 && (
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
              {step === 2 && (
                <button
                  onClick={handleCompleteCheckout}
                  className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-full hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-lg animate-pulse"
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

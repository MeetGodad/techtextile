"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
import ShippingRateCalculator from '../ShippingRatesCalculation/ShippinhRates';
import AddressInput from '../components/AddressInput';
import { sendOrderConfirmationEmails } from './emailService';
import  StripeForm  from './stripePayment';

const Checkout = () => {
  const router = useRouter();
  const { user } = useUserAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [orderId, setOrderId] = useState(null);
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
    stateCode: '',
    countryCode: '',
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
        country: signupAddress.countryCode || '',
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

  const handleSubmit = async () => {
    try {
      console.log('Shipping Info:', shippingInfo);
      console.log(cart);
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
          country: shippingInfo.countryCode,
          email: shippingInfo.email,
          cart,
          shippingDetails,
          totalShippingCost: totalShippingCost.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        }),
        
      });
      const data = await response.json();
      if (response.ok) {
        setOrderId(data.orderId); // Save the orderId to state
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

  const handlePayAndSubmit = async () => {
    try {
      const orderId = await handleSubmit();
      if (orderId) {
        setStep(3); // Move to the payment step if order submission is successful
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

const handleSuccess = async () => {
  try {
    // Assume payment success logic here (handled in your StripeForm component or similar)
    console.log('Payment successful');
    setStep(4); // Move to Step 4 after successful payment

    // Send confirmation emails upon moving to Step 4+
    try {
      const orderDetails = {
        userId: user.uid,
        orderId: orderId, // Assuming orderId is accessible here after successful submission
        shippingInfo,
        cart,
        totalShippingCost: totalShippingCost.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      };

      console.log('Attempting to send confirmation email');
      const emailSent = await sendOrderConfirmationEmails(orderDetails);
      if (emailSent) {
        console.log('Confirmation email sent successfully');
      } else {
        throw new Error('Failed to send confirmation email');
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      setError('Payment succeeded, but failed to send confirmation email.');
    }
  } catch (error) {
    console.error('Failed to process payment:', error);
    setError('Failed to process payment. Please try again.');
  }
};


const handleAddressChange = (address) => {
    setShippingInfo({
      firstName: address.address_first_name || '',
      lastName: address.address_last_name || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.postal_code || '',
      country: address.countryCode || '',
      email: address.address_email || '',
      phone: address.phone_num || '',
    });
  setUseSignupAddress(false);
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
              <label htmlFor="useSignupAddress" className="ml-2 text-black">
                Use the same address as signup address
              </label>
            </div> 
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-lg font-semibold mb-4">Existing Shipping Addresses</h2>
              {existingAddresses.length > 0 ? (
                <div className="relative mb-6">
                  <select
                    onChange={(e) => {
                      const selectedAddress = existingAddresses.find(
                        (address) => address.address_id === parseInt(e.target.value)
                      );
                      handleAddressChange(selectedAddress);
                    }}
                    className="block w-full p-4 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-white text-gray-700"
                  >
                    <option value="" disabled selected className="text-gray-500">
                      Select an existing shipping address
                    </option>
                    {existingAddresses.map((address) => (
                      <option 
                        key={address.address_id} 
                        value={address.address_id}
                        className="truncate"
                      >
                        {`${address.address_first_name} ${address.address_last_name}, ${address.street}, ${address.city}`}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No existing addresses found.</p>
              )}
            </div>         
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={shippingInfo.firstName}
                  onChange={handleShippingChange}
                  className="w-full p-4 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={shippingInfo.lastName}
                  onChange={handleShippingChange}
                  className="w-full p-4 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
            <div className="relative">
              <AddressInput
                supportedCountries={['CA']}
                role="shipping"
                street={shippingInfo.street}
                city={shippingInfo.city}
                state={shippingInfo.state}
                postalCode={shippingInfo.zip}
                country={shippingInfo.countryCode}
                setStreet={(value) => setShippingInfo(prev => ({ ...prev, street: value }))}
                setCity={(value) => setShippingInfo(prev => ({ ...prev, city: value }))}
                setPostalCode={(value) => setShippingInfo(prev => ({ ...prev, zip: value }))}
                setState={(value) => setShippingInfo(prev => ({ ...prev, state: value }))}
                setCountry={(value) => setShippingInfo(prev => ({ ...prev, country: value }))}
                setStateCode={(value) => setShippingInfo(prev => ({ ...prev, stateCode: value }))}
                setCountryCode={(value) => setShippingInfo(prev => ({ ...prev, countryCode: value }))}
                inputClassName="w-full p-4 text-black border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                containerClassName="relative mb-4"
                iconClassName="absolute  left-3 top-4 text-gray-400"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={shippingInfo.email}
                  onChange={handleShippingChange}
                  className="w-full p-4 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  pattern="[0-9]{10}"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  className="w-full p-4 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

              {console.log("Buyer Address " , shippingInfo)}

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
                  <p className="text-gray-700 break-words">{shippingInfo.street}</p>
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
                {console.log("Shipping Detail" , shippingDetails)}
            <ShippingRateCalculator
                  cartItems={cart} 
                  buyerAddress={{
                    firstName: shippingInfo.firstName,
                    lastName: shippingInfo.lastName,
                    street: shippingInfo.street,
                    city: shippingInfo.city,
                    state: shippingInfo.stateCode,
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
        case 3:
          return (
            <div className="animate-fade-in-down max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Complete Your Order</h2>
              <StripeForm 
                orderId={orderId} 
                totalPrice={totalPrice} 
                onSuccess={handleSuccess}
              />
            </div>
          );
  
        case 4:
          return (
            <div className="animate-fade-in-down max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">Order Successful!</h2>
              <p className="text-xl text-gray-700 mb-6">Thank you for your purchase.</p>
              <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <button 
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={() => router.push('/Home')}
              >
                Back to Home
              </button>
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
                Step {step} of 4
              </span>
            </div>
            <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${(step / 4) * 100}%` }}
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
                {step > 1 && step < 4 && (
                  <button
                    onClick={handlePreviousStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded-lg px-4 py-2"
                  >
                    Previous
                  </button>
                )}
                {step < 3 && (
                  <button
                    onClick={handleNextStep}
                    disabled={!isStepValid}
                    className={`${
                      isStepValid
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-4 py-2`}
                  >
                    Next
                  </button>
                )}
                {step === 2 && (
                  <button
                    onClick={handlePayAndSubmit}
                    disabled={!isStepValid}
                    className={`${
                      isStepValid
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    } transition-colors duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg px-4 py-2`}
                  >
                    Pay and Submit
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
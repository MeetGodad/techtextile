// References
// ChatGpt: https://chatgpt.com/c/fd190831-d95b-42ba-9f37-2847b4796d64
// Styling: https://www.w3schools.com/react/react_css_styling.asp
// CSS: https://tailwindcss.com/docs/installation
// Email Service: https://dashboard.emailjs.com/admin/account
// Stripe: https://dashboard.stripe.com/test/apikeys
// Next.js: https://nextjs.org/learn/dashboard-app

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
import ShippingRateCalculator from '../ShippingRatesCalculation/ShippinhRates';
import AddressInput from '../components/AddressInput';
import { sendOrderConfirmationEmails } from './emailService';
import  StripeForm  from './stripePayment';
import Swal from 'sweetalert2';


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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressLoaded, setIsAddressLoaded] = useState(true);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    if (isAddressLoaded) {
      setIsFormLoaded(true);
    }
  }, [isAddressLoaded]);
  


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
  const handleCheckboxChange = (e) => {
    setUseSignupAddress(e.target.checked);
    if (e.target.checked) {
      if (signupAddress.country === 'IN') {
        Swal.fire({
          title: 'Address Country Not Supported',
          text: 'At this time any other addresses are not supported for shipping. Please provide a Canadian Address',
          icon: 'error',
          confirmButtonText: 'OK'
      });
        setUseSignupAddress(false);
      } else {
      setShippingInfo({
        firstName: signupAddress.address_first_name || '',
        lastName: signupAddress.address_last_name || '',
        street: signupAddress.street || '',
        city: signupAddress.city || '',
        stateCode: signupAddress.state || '',
        zip: signupAddress.postal_code || '',
        countryCode: signupAddress.country || '',
        email: signupAddress.address_email || '',
        phone: signupAddress.phone_num || '',
      });
    }
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
    const { firstName, lastName, street, city, stateCode, zip, email, countryCode } = shippingInfo;
    setIsStepValid(firstName && lastName && street && city && stateCode && zip && email && countryCode);
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
    setIsSubmitting(true);

    try {
        console.log('Shipping Info:', shippingInfo);
        console.log('Cart:', cart);

        // Show loading state
        Swal.fire({
            title: 'Placing your order...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

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
                state: shippingInfo.stateCode,
                zip: shippingInfo.zip,
                country: shippingInfo.countryCode,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
                cart,
                shippingDetails,
                totalShippingCost: totalShippingCost.toFixed(2),
                totalPrice: totalPrice.toFixed(2),
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setOrderId(data.orderId);
            Swal.fire({
                title: 'Order has been Placed Successfully! 🎉 Please Complete The Payment',
                text: `Your order ID is: ${data.orderId}`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            return data.orderId;
        } else {
            throw new Error(data.message || 'Failed to submit order');
        }
    } catch (error) {
        console.error('Error submitting order:', error);

        let errorMessage = 'An unexpected error occurred. Please try again.';

        // Handle specific error messages from the backend
        if (error.message.includes('Duplicate entry')) {
            errorMessage = 'This order has already been placed. Please check your orders.';
        } else if (error.message.includes('Invalid data')) {
            errorMessage = 'Some of the order information is invalid. Please check and try again.';
        } else if (error.message.includes('Missing required field')) {
            errorMessage = 'Please fill in all required fields and try again.';
        }

        Swal.fire({
            title: 'Order Placement Failed',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
        });

        return null;
    } finally {
        setIsSubmitting(false);
    }
};

  const handlePayAndSubmit = async () => {
    try {
      const orderId = await handleSubmit();
      if (orderId) {
        setStep(3);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

const handleSuccess = async () => {
  try {
    setStep(4);

    // Send confirmation emails upon moving to Step 4
    try {
      const orderDetails = {
        userId: user.uid,
        orderId: orderId, // Assuming orderId is accessible here after successful submission
        shippingInfo,
        cart,
        totalShippingCost: totalShippingCost.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      };
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
  if (address) {
    setSelectedAddressId(address.address_id);  // Update the selected address id
    setUseSignupAddress(false);  // Optionally uncheck the checkbox if an address is selected
  }
    setShippingInfo({
      firstName: address.address_first_name || '',
      lastName: address.address_last_name || '',
      street: address.street || '',
      city: address.city || '',
      stateCode: address.state || '',
      zip: address.postal_code || '',
      countryCode: address.country || '',
      email: address.address_email || '',
      phone: address.phone_num || '',
    });
  setUseSignupAddress(false);
};

const filteredExistingAddresses = existingAddresses.filter(address => address.country !== 'IN');

const renderStep = () => {
  switch (step) {
    case 1:
      return (
        <div>
          {!isFormLoaded ? (
            <div className='text-black'>Loading...</div>
          ) : (
          <div className="animate-fade-in-down">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Shipping Details</h2>
            <form className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto transform transition duration-500 hover:shadow-2xl hover:scale-105">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useSignupAddress"
                  name="useSignupAddress"
                  checked={useSignupAddress}
                  onChange={handleCheckboxChange}
                  disabled={selectedAddressId !== null}
                  className="form-checkbox h-5 w-5 text-blue-500 transition duration-300 ease-in-out transform hover:scale-110"
                />
                <label htmlFor="useSignupAddress" className="ml-2 text-black">
                  Use the same address as signup address
                </label>
              </div>
              <div className="w-full max-w-md mx-auto">
                <h2 className="text-lg font-semibold mb-4">Existing Shipping Addresses</h2>
                {filteredExistingAddresses.length > 0 ? (
                  <div className="relative mb-10">
                    <select
                      onChange={(e) => {
                        const selectedAddress = filteredExistingAddresses.find(
                          (address) => address.address_id === parseInt(e.target.value)
                        );
                        handleAddressChange(selectedAddress);
                      }}
                      className="block w-full p-4 pr-8 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-white text-gray-700 hover:bg-gray-50"
                      disabled={useSignupAddress}
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
                          {`${address.address_first_name} ${address.address_last_name}, ${address.street}, ${address.city} ${address.postal_code}, ${address.country}`}
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
                <div className="relative group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder=" "
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
                  />
                  <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
                    First Name
                  </label>
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2a8.001 8.001 0 00-7.938 7h15.876A8.001 8.001 0 0010 12z" />
                  </svg>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder=" "
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
                  />
                  <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
                    Last Name
                  </label>
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2a8.001 8.001 0 00-7.938 7h15.876A8.001 8.001 0 0010 12z" />
                  </svg>
                </div>
              </div>  
              <div className="relative group">
                <AddressInput
                  setIsAddressLoaded={setIsAddressLoaded}
                  supportedCountries={['CA']}
                  role="shipping"
                  street={shippingInfo.street}
                  city={shippingInfo.city}
                  state={shippingInfo.stateCode}
                  postalCode={shippingInfo.zip}
                  country={shippingInfo.countryCode}
                  setStreet={(value) => setShippingInfo(prev => ({ ...prev, street: value }))}
                  setCity={(value) => setShippingInfo(prev => ({ ...prev, city: value }))}
                  setPostalCode={(value) => setShippingInfo(prev => ({ ...prev, zip: value }))}
                  setState={(value) => setShippingInfo(prev => ({ ...prev, stateCode: value }))}
                  setCountry={(value) => setShippingInfo(prev => ({ ...prev, countryCode: value }))}
                  setStateCode={(value) => setShippingInfo(prev => ({ ...prev, stateCode: value }))}
                  setCountryCode={(value) => setShippingInfo(prev => ({ ...prev, countryCode: value }))}
                  inputClassName="w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white"
                  containerClassName="relative mb-4 group"
                  iconClassName="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
                  />
                  <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
                    Email
                  </label>
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2.5 0v.8l5.5 3.3 5.5-3.3V5H4.5zM4 15h12V7.5l-5.5 3.3-5.5-3.3V15z" />
                  </svg>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder=" "
                    pattern="[0-9]{10}"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className="peer w-full p-4 pl-12 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 group-hover:bg-white placeholder-transparent"
                    />
                    <label className="absolute left-12 top-4 text-gray-500 transition-all duration-300 peer-focus:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:-ml-1 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-blue-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:-ml-1">
                      Phone Number
                    </label>
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path d="M2.003 5.884l2.122-2.122a1 1 0 011.415 0l1.414 1.414a1 1 0 010 1.415l-1.293 1.293a12.042 12.042 0 005.657 5.657l1.293-1.293a1 1 0 011.415 0l1.414 1.414a1 1 0 010 1.415l-2.122 2.122a1 1 0 01-1.415 0C6.403 16.835 3.165 13.597 2.003 9.3a1 1 0 010-1.415z" />
                  </svg>
                </div>
              </div>
            </form>
          </div> 
          )}
          </div>
        );
       
        
        case 2:
        return (
          <div className="animate-fade-in-down max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Review Your Order</h2>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-50 p-4 rounded-md transition-all duration-300 hover:shadow-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Shipping Information</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p className="text-gray-700">{shippingInfo.street}</p>
                    <p className="text-gray-700">{shippingInfo.city}, {shippingInfo.stateCode}, {shippingInfo.zip}</p>
                    <p className="text-gray-700">{shippingInfo.email}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-blue-700">Cart Items</h3>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-4 transition-all duration-300 hover:bg-gray-50 rounded-md p-2">
                        <div className="flex items-center space-x-3">
                          <img src={item.image_url.split(',')[0]} alt={item.product_name} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                          <div>
                            <p className="font-semibold text-gray-800">{item.product_name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-600">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center">Your cart is empty</p>
                )}
              </div>
              <div className="flex justify-between font-bold text-black text-base border-t pt-4">  
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
            <div className="animate-fade-in-down max-w-md mx-auto mt-8">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Complete Your Order</h2>
                  <p className="text-blue-100">You&apos;re just one step away from your purchase!</p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">Order Total:</p>
                    <p className="text-3xl font-bold text-gray-800">${totalPrice.toFixed(2)}</p>
                  </div>
                  <StripeForm 
                    orderId={orderId} 
                    totalPrice={totalPrice} 
                    onSuccess={handleSuccess}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Secure payment powered by{' '}
                  <span className="font-semibold text-blue-600">Stripe</span>
                </p>
              </div>
            </div>
          );
  
        case 4:
          return (
            <div className="animate-fade-in-down max-w-md mx-auto mt-8">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 ease-in-out">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6">
                  <h2 className="text-3xl font-extrabold text-white mb-2">Order Successful!</h2>
                  <p className="text-xl text-white opacity-90">Thank you for your purchase.</p>
                </div>
                <div className="p-8">
                  <div className="mb-8 relative">
                    <svg className="w-24 h-24 mx-auto text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-8">Your order has been processed and will be shipped soon.</p>
                  <button 
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 animate-pulse"
                    onClick={() => router.push('/Home')}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Order confirmation sent to your email
                </p>
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
                {step < 2 && (
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
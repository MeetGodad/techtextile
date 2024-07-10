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
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
  });
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
    validateStep();
  };

  const validateStep = () => {
    const { firstName, lastName, address, city, state, zip, email } = shippingInfo;
    setIsStepValid(firstName && lastName && address && city && state && zip && email);
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

  const handlePayAndSubmit = async () => {
    const orderId = await handleSubmit();
    if (orderId) {
      router.push(`Payment/?orderId=${orderId}`);
    } else {
      alert('Failed to create order. Please try again.');
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
          <div>
            <h3>Cart Items</h3>
            <ul>
              {cart.map(item => (
                <li key={item.id}>{item.name} - {item.quantity}</li>
              ))}
            </ul>
          </div>
          <button type="button" onClick={() => setStep(1)}>Back</button>
          <button type="button" onClick={handlePayAndSubmit}>Submit and Pay</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

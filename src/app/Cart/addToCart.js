"use client";
import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch cart data from local storage or API
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
      );
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    // Handle checkout logic
    alert('Proceeding to checkout');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white border border-gray-200">
          <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 font-bold">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Subtotal</div>
          </div>
          {cart.map(item => (
            <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-200" key={item.id}>
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                <div>{item.name}</div>
              </div>
              <div>${item.price}</div>
              <div>
                <select
                  className="border border-gray-300 rounded"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                >
                  {[...Array(10).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>${item.price * item.quantity}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-100 border-t border-gray-200">
        <div className="flex justify-end space-x-4">
          <div className="text-right">
            <div>Subtotal: ${calculateSubtotal()}</div>
            <div>Shipping: Free</div>
            <div className="font-bold">Total: ${calculateSubtotal()}</div>
            <button
              className="mt-4 px-6 py-2 bg-black text-white font-bold rounded"
              onClick={handleCheckout}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

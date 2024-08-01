// References
// ChatGpt: https://chatgpt.com/c/fd190831-d95b-42ba-9f37-2847b4796d64
// Styling: https://www.w3schools.com/react/react_css_styling.asp
// CSS: https://tailwindcss.com/docs/installation
// Next.js: https://nextjs.org/learn/dashboard-app

"use client";

import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { useRouter } from 'next/navigation';

export default function Cart({ children }) {
  const [cart, setCart] = useState([]);
  const [errorMessages, setErrorMessages] = useState('');
  const { user } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const response = await fetch(`/api/cart/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching the cart:', error);
    }
  };

  
  const updateQuantity = async (cart_item_id, quantity, variantIds) => {
    try {
      console.log('Updating quantity for item:', cart_item_id);
      console.log('New quantity:', quantity);
      console.log('Variant IDs:', variantIds);
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        setErrorMessages('Please enter a valid quantity');
        return;
      }
      const variant = cart.find(item => item.cart_item_id === cart_item_id).selected_variant;
      const availableQuantity = parseInt(variant.quantity);

      if (parsedQuantity > availableQuantity) {
        setErrorMessages(`Only ${availableQuantity} items available in stock`);
        return;
      }
      setErrorMessages('');
      if (user) {
        const body = {
          cartItemId: cart_item_id,
          quantity: parsedQuantity,
          variantIds: variantIds,
        };


        const response = await fetch(`/api/cart/${user.uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }
        const updatedCart = cart.map(item => {
          if (item.cart_item_id === cart_item_id) {
            return { ...item, quantity: parsedQuantity };
          }
          return item;
        });
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItemId: cartItemId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      const deletedItem = await response.json();
      setCart(prevCart => prevCart.filter(item => item.cart_item_id !== deletedItem.cart_item_id));

      const event = new Event('cartUpdated');
      window.dispatchEvent(event);

    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      if (isNaN(price) || isNaN(quantity)) {
        return total;
      }
      return total + price * quantity;
    }, 0);
  };

  const canProceedToCheckout = () => {
    // Check if there are any items in the cart that are out of stock or have zero quantity
    return cart.every(item => {
      return parseInt(item.selected_variant.quantity) > 0 && item.quantity > 0;
    });
  };

  const handleCheckout = () => {
    if (canProceedToCheckout()) {
      router.push('/Checkout');
    } else {
      alert('Please remove out-of-stock items or items with zero quantity before proceeding to checkout.');
    }
  };

  return (
    <div className="bg-gray-600 p-8 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
        <h1 className="text-5xl font-extrabold mb-12 text-gray-800 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 animate-gradient">
          Your Shopping Cart
        </h1>
        {cart.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-gray-200 rounded-2xl p-6 shadow-lg transform transition duration-500 hover:shadow-2xl hover:translate-y-[-5px]"
                >
                  <div className="relative mb-6 group overflow-hidden rounded-xl"
                    onClick={() => handleProductClick(item.product_id)}
                  >
                    <img 
                      src={item.image_url.split(',')[0]}  
                      alt={item.product_name} 
                      className="w-full h-48 object-cover transition duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition duration-300">{item.product_name}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-4 text-gray-800">${parseFloat(item.price).toFixed(2)}</div>
                  {item.selected_variant && (
                    <div className="mb-4">
                      <label className="block font-semibold text-gray-700 mb-2">Variant:</label>
                      <div className="text-gray-600 mb-2">
                        {item.selected_variant.color && (
                          <div className="flex items-center">
                            <span className="font-semibold">Color: </span>
                            <span 
                              className="inline-block w-5 h-5 rounded-full ml-2 border-2 border-black transform transition duration-300 ease-in-out hover:scale-110 hover:border-white"
                              style={{ backgroundColor: item.selected_variant.color.split(':')[1]?.trim() || item.selected_variant.color }}
                            ></span>
                          </div>
                        )}
                        {item.selected_variant.denier && (
                          <div>
                            <span className="font-semibold">Denier: </span>
                            <span>{item.selected_variant.denier.split(':')[1]?.trim() || item.selected_variant.denier}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Quantity</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-white border-2 border-gray-300 rounded-full py-2 px-12 text-gray-800 text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                        max={item.selected_variant.quantity}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.cart_item_id, e.target.value, item.variant_ids)}
                        disabled={parseInt(item.selected_variant.quantity) === 0}
                      />
                      <button
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={() => updateQuantity(item.cart_item_id, Math.max(1, item.quantity - 1), item.variant_ids)}
                        disabled={parseInt(item.selected_variant.quantity) === 0 || item.quantity <= 1}
                      >
                        <span className="text-xl font-semibold">−</span>
                      </button>
                      <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={() => updateQuantity(item.cart_item_id, Math.min(item.selected_variant.quantity, item.quantity + 1), item.variant_ids)}
                        disabled={parseInt(item.selected_variant.quantity) === 0 || item.quantity >= item.selected_variant.quantity}
                      >
                        <span className="text-xl font-semibold">+</span>
                      </button>
                    </div>
                    {errorMessages && <div className="text-red-500 text-sm mt-2 animate-bounce">{errorMessages}</div>}
                  </div>
                  {parseInt(item.selected_variant.quantity) === 0 && (
                    <p className="text-red-500 text-sm mb-2 animate-pulse">Product is out of stock</p>
                  )}
                  <div className="font-semibold text-gray-700 mb-4">Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => removeItem(item.cart_item_id)} 
                    className="text-red-500 font-semibold hover:text-red-700 transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-full px-4 py-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-end">
              <div className={`bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl shadow-xl transform transition duration-500 hover:shadow-2xl ${canProceedToCheckout() ? 'cursor-pointer hover:translate-y-[-5px]' : 'cursor-not-allowed opacity-50'}`}>
                <div className="text-2xl font-bold text-white mb-2">Subtotal: ${calculateSubtotal().toFixed(2)}</div>
                <div className="text-lg text-gray-400 mb-4">Shipping to be calculated in next step</div>
                <div className="text-3xl font-extrabold text-white mb-6">Total: ${calculateSubtotal().toFixed(2)}</div>
                <button
                  className="w-full py-4 bg-white text-gray-900 font-bold rounded-full transition duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 relative overflow-hidden group"
                  onClick={handleCheckout}
                  disabled={!canProceedToCheckout()}
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">Proceed to Checkout</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-bounce">Your cart is as empty as the vast cosmos</h2>
            <p className="text-xl text-gray-600 mb-10">Time to fill it with some interstellar treasures!</p>
            <button
              onClick={() => router.push('/Home')}
              className="px-8 py-3 bg-gradient-to-r from-gray-700 to-black text-white font-bold rounded-full hover:from-gray-800 hover:to-gray-900 transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 relative overflow-hidden group"
            >
              <span className="relative z-10">Explore the Galaxy</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white transition-all duration-300 group-hover:scale-100"></div>
              <span className="absolute inset-0 flex items-center justify-center text-gray-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">Explore the Galaxy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
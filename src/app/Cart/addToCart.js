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

  const updateQuantity = async (cart_item_id, quantity , variantIds) => {
    try {
      console.log(cart_item_id, quantity) 
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        setErrorMessages('Please enter a valid quantity');
        return;
      }
      setErrorMessages('');
      if(user){

        const body = {
          cartItemId: cart_item_id,
          quantity: parsedQuantity,
        };
        if (variantIds && variantIds.length > 0) {
          body.variantIds = variantIds;
        }
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
          cartItemId: cartItemId  
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

  const handleCheckout = () => {
    router.push('/Checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray via-black to-black p-8">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold mb-12 text-black text-center animate-pulse">
          Your Cart
        </h1>
        {cart.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cart.map((item) => (
                <div 
                  key={item.cart_item_id} 
                  className="bg-white-800 bg-opacity-50 rounded-2xl p-6 transform transition duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl"
                >
                  <div className="relative mb-6 group">
                    <img 
                      src={item.image_url.split(',')[0]} 
                      alt={item.product_name} 

                      className="w-full h-48 object-cover rounded-xl shadow-md transition duration-300 group-hover:shadow-xl"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">{item.product_name}</span>
                    </div>
                  </div>
                  <div className="text-black font-bold text-2xl mb-4">${parseFloat(item.price).toFixed(2)}</div>
                  <div className="mb-6">
                    <label className="block text-black-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      className="w-full bg-gray-700 border-2 border-black-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.cart_item_id, 
                          e.target.value, 
                          item.selected_variants ? item.selected_variants.map(v => v.variant_id) : []
                         )}

                    />
                    {errorMessages && <div className="text-red-300 text-sm mt-2 animate-bounce">{errorMessages}</div>}
                  </div>
                  <div className="font-semibold text-black-300 mb-4">Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() =>  removeItem(item.cart_item_id)} 
                    className="text-red-500 hover:text-red transition duration-300 transform hover:scale-110"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-end">
              <div className="bg-white-800 bg-opacity-50 p-8 rounded-2xl shadow-xl transform transition duration-500 hover:scale-105 hover:-rotate-1">
                <div className="text-2xl font-bold text-black mb-2">Subtotal: <span className="text-black-300">${calculateSubtotal().toFixed(2)}</span></div>
                <div className="text-lg text-black-400 mb-4">Shipping: Free</div>
                <div className="text-3xl font-extrabold text-black mb-6">Total: <span className="text-black-300">${calculateSubtotal().toFixed(2)}</span></div>
                <button
                  className="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-full transition duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 animate-float">
            <h2 className="text-3xl font-bold text-white mb-6">Your cart is as empty as space</h2>
            <p className="text-xl text-gray-400 mb-10">Time to fill it with some stellar items!</p>
            <button
              onClick={() => router.push('/Home')}
              className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold rounded-full hover:from-gray-800 hover:to-black transition duration-300 transform hover:scale-110 hover:rotate-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Explore the Galaxy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
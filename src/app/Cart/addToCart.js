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
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto px-4 py-8 animate-fade-in-down">
        <h1 className="text-4xl font-bold mb-8 text-black">Your Shopping Cart</h1>
        {cart.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="w-full bg-gray-50 p-4 font-semibold text-gray-800">
                  <div className="grid grid-cols-5 gap-4">
                    <div>Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Subtotal</div>
                    <div>Action</div>
                  </div>
                </div>
                {cart.map((item, index) => (
                  <div 
                    key={item.product_id} 
                    className="w-full p-4 border-t text-black border-gray-200 transition-all duration-300 hover:bg-gray-50"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div className="flex items-center space-x-4">
                        
                        <img src={item.image_url.split(',')[[0]]} alt={item.product_name} className="w-16 h-16 object-cover rounded-md shadow-sm" />
                        <div className="font-medium">{item.product_name}</div>
                      </div>
                      <div className="text-black-600 font-semibold">${parseFloat(item.price).toFixed(2)}</div>
                      <div>
                        <input
                          type="number"
                          className="border border-gray-300 rounded-md w-20 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                        />
                        {errorMessages && <div className="text-red-500 text-sm mt-1">{errorMessages}</div>}
                      </div>
                      <div className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                      <div>
                        <button 
                          onClick={() => removeItem(item.product_id)} 
                          className="text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <div className="text-right bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="text-xl font-semibold text-gray-800">Subtotal: <span className="text-black-600">${calculateSubtotal().toFixed(2)}</span></div>
                <div className="text-sm text-gray-500 mt-1">Shipping: Free</div>
                <div className="text-2xl font-bold mt-4 text-gray-800">Total: <span className="text-black-600">${calculateSubtotal().toFixed(2)}</span></div>
                <button
                  className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-full transition-all duration-300 transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => router.push('/Home')}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
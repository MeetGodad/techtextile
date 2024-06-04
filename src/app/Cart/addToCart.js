"use client";
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';


const Cart = () => {
  const [cart, setCart] = useState([]);
  const { user } = useUserAuth();

  
  useEffect(() => {
    if (user) {
      const userId = user.uid;
      fetch(`/api/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data && typeof data === 'object') {
            setCart([data]);
          } else {
            console.error('Server response is not an object:', data);
          }
        })
        .catch(error => {
          console.error('Unexpected server response:', error);
        });
    }
  }, [user]);

  const updateQuantity = (productId, quantity) => {
    fetch(`/api/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: parseInt(quantity) }),
    })
      .then(response => response.json())
      .then(updatedItem => {
        const updatedCart = cart.map(item =>
          item.product_id === productId ? updatedItem : item
        );
        setCart(updatedCart);
      });
  };

  const removeItem = (productId) => {
    fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedCart = cart.filter(item => item.product_id !== productId);
        setCart(updatedCart);
      });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout');
  };

  return (
    <div className="container  mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="overflow-x-auto">
        <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="w-full bg-gray-100 p-4 font-semibold text-gray-800">
            <div className="grid grid-cols-5 gap-4">
              <div>Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Subtotal</div>
              <div>Action</div>
            </div>
          </div>

              {cart.map(item => {
                console.log(item);
                 const images = item.image_url ? item.image_url.split(',') : [];
                return (
                <div key={item.product_id} className="w-full p-4 border-t text-black border-gray-200">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={images[0]} alt={item.product_name} className="w-16 h-16 object-cover" />
                      <div>{item.product_name}</div>
                    </div>
                    <div>${Number(item.price).toFixed(2)}</div>
                    <div>
                      <input
                        type="number"
                        className="border border-gray-300 rounded w-16"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product_id, e.target.value)}
                      />
                    </div>
                    <div>${Number((item.price * item.quantity)).toFixed(2)}</div>
                    <div>
                      <button onClick={() => removeItem(item.product_id)} className="text-red-500">Remove</button>
                    </div>
                  </div>
                </div>
              )})}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="text-right">
          <div className="text-lg font-semibold">Subtotal: ${Number(calculateSubtotal()).toFixed(2)}</div>
          <div className="text-sm text-gray-400">Shipping: Free</div>
          <div className="text-lg font-bold mt-2">Total: ${Number(calculateSubtotal()).toFixed(2)}</div>
          <button
            className="mt-4 px-6 py-2 bg-black text-white font-bold rounded"
            onClick={handleCheckout}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

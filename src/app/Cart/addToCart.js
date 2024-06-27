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
    <div className="container mx-auto px-4 py-8">
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
          {cart.map(item => (
            
            <div key={item.product_id} className="w-full p-4 border-t text-black border-gray-200">
            
              <div className="grid grid-cols-5 gap-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image_url.split(',')[0]} alt={item.product_name} className="w-16 h-16 object-cover" />
                  <div>{item.product_name}</div>
                </div>
                <div>${parseFloat(item.price).toFixed(2)}</div>
                <div>
                  <input
                    type="number"
                    className="border border-gray-300 rounded w-16"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                       updateQuantity(
                        item.cart_item_id, 
                        e.target.value, 
                        item.selected_variants ? item.selected_variants.map(v => v.variant_id) : []
                      )}
                  />
                  {errorMessages && <div className="text-red-500 text-sm">{errorMessages}</div>}
                </div>
                <div>${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                <div>
                  <button onClick={() => removeItem(item.cart_item_id)} className="text-red-500">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="text-right">
          <div className="text-lg font-semibold">Subtotal: ${calculateSubtotal().toFixed(2)}</div>
          <div className="text-sm text-gray-400">Shipping: Free</div>
          <div className="text-lg font-bold mt-2">Total: ${calculateSubtotal().toFixed(2)}</div>
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
}

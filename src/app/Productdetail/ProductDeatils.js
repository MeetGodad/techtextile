"use client";

import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';

export default function ProductDetail({productId}) {
  const { user } = useUserAuth();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data[0]);
        } else {
          console.error('Error fetching product details:', data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const addToCart = async (product) => {
    if (!user) {
      alert('Please sign up or log in first.');
      return;
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid, productId: product.product_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const updatedCart = await response.json();

      const index = cart.findIndex((item) => item.product_id === updatedCart.product_id);
      if (index !== -1) {
        cart[index] = updatedCart;
      } else {
        cart.push(updatedCart);
      }

      setCart([...cart]);

      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loder />
      </div>
    );
  }

  if (!product) {
    return <div className="w-full min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    
    <div className="w-full min-h-screen text-black bg-white p-8 overflow-x-auto overflow-hidden">
        {console.log(product)}
        <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
                <img
                className="w-full h-auto"
                src={product.image_url}
                alt={product.product_name}
                />
            </div>
            <div className="md:w-1/2 md:pl-8">
                <h1 className="text-3xl font-semibold mb-4">{product.product_name}</h1>
                <p className="text-lg mb-4">{product.product_description}</p>
                <p className="text-2xl font-semibold mb-4">${product.price}</p>
                <button
                className="px-4 py-2 bg-black text-white rounded-lg"
                onClick={() => addToCart(product)}
                >
                Add to cart
                </button>
            </div>
            </div>
        </div>
    </div>
    
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = router.query;
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
          setProduct(data);
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
    <div className="w-full min-h-screen bg-white p-8 overflow-x-auto overflow-hidden">
      <main className="max-w-screen-xl mx-auto">
        <section className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <img src={product.image_url} alt={product.product_name} className="w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold">{product.product_name}</h1>
            <p className="text-xl mt-4">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

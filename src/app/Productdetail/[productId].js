// https://chatgpt.com/c/1c41013e-3b45-46ec-8fdf-30ece2ae6196 
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserAuth } from '../auth/auth-context';
import Loader from '../components/Loder';

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = router.query;
  const { user } = useUserAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products?productId=${productId}`);
          const data = await response.json();
          if (response.ok) {
            setProduct(data);
          } else {
            console.error('Error fetching product:', data.message);
          }
        } catch (error) {
          console.error('Error fetching the product:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
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
      setCart((prevCart) => [...prevCart, updatedCart]);

      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img src={product.image_url} alt={product.product_name} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:pl-4">
          <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>
          <p className="mb-2">{product.product_description}</p>
          <p className="text-xl font-semibold mb-2">${product.price}</p>
          <button 
            onClick={() => addToCart(product)}
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

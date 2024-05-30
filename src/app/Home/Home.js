"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';

export default function Home() {
  const { user } = useUserAuth(); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (product) => {
    if (!user) {
      alert('Please sign up or log in first.');
      return;
    }
    const updatedCart = [...cart];
    const existingProduct = updatedCart.find(item => item.product_id === product.product_id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Dispatch an event to notify that the cart has been updated
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <main className="max-w-screen-xl mx-auto">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductSection
              key={product.product_id}
              name={product.product_name}
              price={product.price}
              image={product.image_url}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

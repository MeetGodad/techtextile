//https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option
"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';

export default function Home() {
  const { user } = useUserAuth(); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
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
  const showMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
  };

  return (
    <div className="w-full min-h-0 bg-white p-8 overflow-x-auto overflow-hidden">
      <main className="max-w-screen-xl mx-auto">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.slice(0, visibleProducts).map((product) => (
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
        {visibleProducts < products.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={showMoreProducts}
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Show More</button>
          </div>
        )}
      </main>
    </div>
  );
};

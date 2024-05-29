"use client";

import { useEffect, useState } from 'react';
import FrameComponent from "../components/ProductSection";
import ProductSection from '../components/ProductSection';

export default function Home() {
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

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <main className="max-w-screen-xl mx-auto">
        <h1 className="text-center text-4xl font-bold mb-8">FABRIC PRODUCTS</h1>
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

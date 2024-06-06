"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';

export default function Home() {
  const { user } = useUserAuth(); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

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
  }, [user]);



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

  return (
  
     (products && products.length > 0) ? (
      
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

    ) : (
      <div className=" w-full min-h-screen h-60 self-center bg-white p-8">
        <Loder />
      </div>
    )
  );
};

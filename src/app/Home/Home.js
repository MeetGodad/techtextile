//https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option
"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';

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
    ) : (
      <div className=" w-full min-h-screen h-60 self-center bg-white p-8">
        <Loder />
      </div>
    )

  );
};

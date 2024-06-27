// https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option
"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home({ category }) {
  const { user } = useUserAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products' , {
          headers: {
            'Cache-Control': 'no-cache',
        }});
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching the products:', error);
      }
    };

    fetchProducts();
  }, [user]);

  const addToCart = async (productId) => {
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
        body: JSON.stringify({
          userId: user.uid,
          productId: productId.product_id,
          quantity: 1, 
          variantIds: [], // Empty array for no variants
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
      
    } catch (error) {
      alert(error.message);
    }
  };


  const showMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
  };

  const handleProductClick = (productId) => {
    router.push(`/productdetail?productId=${productId}`);
  };

  const filteredProducts = category === 'all'
    ? products
    : products.filter(product => product.product_type === category);

  return (
    <div className="w-full min-h-0 bg-white p-8 overflow-x-auto z-20 overflow-hidden" style={{ paddingTop: '100px' }}>
      <main className="max-w-screen-xl mx-auto">
        {products.length > 0 ? (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.slice(0, visibleProducts).map((product) => (
                <ProductSection
                  key={product.product_id}
                  name={product.product_name}
                  price={product.price}
                  image={product.image_url}
                  product={product}
                  onAddToCart={addToCart}
                  onProductClick={handleProductClick}
                />
              ))}
            </section>
            {visibleProducts < filteredProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={showMoreProducts}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <Loder />
        )}
      </main>
    </div>
  );
};

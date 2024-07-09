// https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option
"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home({ category, subCategory, subSubCategory }) {
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
         console.log("Data",data);
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

const filteredProducts = products.filter(product => {
  // Filter by category unless it's 'all'
  if (category !== 'all' && product.product_type !== category) return false;

  const handleProductClick = (productId) => {
    router.push(`/productdetail?productId=${productId}`);
  };

  // Additional filtering based on category
  switch (category) {
    case 'fabric':
      // For 'fabric', check both 'fabricProducts' for 'subCategory' match in 'fabric_print_tech' or 'fabric_material'
     return subCategory ? (product.fabric_print_tech === subSubCategory || product.fabric_material === subSubCategory) : true;
    case 'yarn':
      // For 'yarn', match 'yarn_material' with 'subCategory'
      return subCategory ? product.yarn_material === subCategory : true;
    default:
      // If no specific category logic is needed, return true to include the product
      return true;
  }
});
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
                  onProductClick={() => handleProductClick(product.product_id)}
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

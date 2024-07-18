// https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option, for search option
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';

export default function Home({ category, subCategory, subSubCategory, searchResults }) {
  const { user } = useUserAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const images = [
    "/Images/fashion shop.gif",
    "/Images/Choosing clothes.gif"
  ];

  useEffect(() => {
    if (!searchResults || searchResults.length === 0) {
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products', {
            headers: {
              'Cache-Control': 'no-cache',
          }});
          const data = await response.json();
          setProducts(data);
          console.log("Data", data);
        } catch (error) {
          console.error('Error fetching the products:', error);
        }
      };
      fetchProducts();
    } else {
      setProducts(searchResults);
    }
  }, [searchResults]);

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
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const showMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 12);
  };
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    // Filter by category unless it's 'all'
    if (category !== 'all' && product.product_type !== category) return false;
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
  }) : [];
  const handleProductClick = (productId , averageRating) => {
    router.push(`/productdetail?productId=${productId}&averageRating=${averageRating}`);
  };
  return (
    <div className="flex flex-col w-full min-h-0 bg-white p-8 overflow-x-auto z-20 overflow-hidden">
      <main className="max-w-screen-xl mx-auto mt-20">
        {products.length > 0 ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 product-grid">
              {filteredProducts.slice(0, visibleProducts).map((product) => (
                <ProductSection
                  key={product.product_id}
                  name={product.product_name}
                  price={product.price}
                  image={product.image_url}
                  product={product}
                  averageRating={product.average_rating}
                  onProductClick={() => handleProductClick(product.product_id , product.average_rating)} />
              ))}
            </section>
            {visibleProducts < filteredProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={showMoreProducts}
                  className="bg-black text-white border-black border-2 px-4 py-2 rounded hover:bg-white hover:text-black">
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <Loder/>
        )}
      </main>
    </div>
  );
}
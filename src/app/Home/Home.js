// https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option, for search option
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const SlideShowContainer = styled.div`
  width: 300px;
  height: 250px; // adjust as necessary
  overflow: hidden;
  margin-bottom: 20px; // space between slideshow and products
`;

const Slide = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${({ fadeType }) => (fadeType === 'in' ? fadeIn : fadeOut)} 1s ease-in-out;
`;

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
  }, [user, searchResults]);


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

const handleProductClick = (productId) => {
  router.push(`/productdetail?productId=${productId}`);
};

  return (
    <div className="flex flex-col w-full min-h-0 bg-white p-8 overflow-x-auto z-20 overflow-hidden">
      <div className="bg-gray-400 box-content">
      {/* Animated slideshow */}
        <SlideShowContainer>
          {images.map((image, index) => (
            <Slide
              key={index}
              src={image}
              alt={`Textile Image ${index + 1}`}
              fadeType={index === currentImageIndex ? 'in' : 'out'}
            />
          ))}
        </SlideShowContainer>
      </div>
      <main className="max-w-screen-xl mx-auto mt-20"> {/* Add margin-top to move products down */}
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
                  onAddToCart={addToCart}
                  onProductClick={() => handleProductClick(product.product_id)} />
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


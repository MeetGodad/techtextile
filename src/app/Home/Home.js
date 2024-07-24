// https://chatgpt.com/c/430cb78b-6262-406a-bd65-8e3203424fa8 // for the show more option, for search option
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';

export default function Home({ category, subCategory, subSubCategory, searchResults }) {
  const { user } = useUserAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState('none');
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
        } catch (error) {
          console.error('Error fetching the products:', error);
        }
      };
      fetchProducts();
    } else {
      setProducts(searchResults);
    }
  }, [searchResults]);

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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortProducts = (products) => {
      switch (sortOrder) {
        case 'lowToHigh':
          return [...products].sort((a, b) => a.price - b.price);
        case 'highToLow':
          return [...products].sort((a, b) => b.price - a.price);
        case 'latest':
          return [...products].sort((a, b) => Number(b.product_id) - Number(a.product_id));
        case 'oldest':
          return [...products].sort((a, b) => Number(a.product_id) - Number(b.product_id));
        default:
          return products;
      }
  };

  const sortedAndFilteredProducts = sortProducts(filteredProducts);

  return (
    <div className="relative flex flex-col w-full min-h-0 bg-white overflow-x-auto z-20 overflow-hidden">
      {/* Background Image Section */}
      <div className="relative h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url('../Images/Choosing clothes.gif')` }}>
        <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50 text-white">
          <h1 className="text-5xl font-bold mb-4">Fabric Sourcing. Simplified.</h1>
          <p className="text-2xl">Tech-enabled Sourcing-to-Production</p>
          <p className="text-2xl">AI-enabled Fabric-to-Garment Visualization</p>
          <p className="text-2xl">Trusted by 400+ Private Labels Globally</p>
        </div>
      </div>

      {/* Product Listing Section */}
      <main className="max-w-screen-xl mx-auto mt-20">
        <div className="flex justify-end mb-4">
          <select value={sortOrder} onChange={handleSortChange} className="border p-2 rounded">
            <option value="none">Sort by</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="latest">Latest Product</option>
            <option value="oldest">Oldest Product</option>
          </select>
        </div>
        {products.length > 0 ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 product-grid">
              {sortedAndFilteredProducts.slice(0, visibleProducts).map((product) => (
                <ProductSection
                  key={product.product_id}
                  name={product.product_name}
                  price={product.price}
                  image={product.image_url}
                  product={product}
                  averageRating={product.average_rating}
                  onProductClick={() => handleProductClick(product.product_id, product.average_rating)}
                />
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
          <Loder />
        )}
      </main>
    </div>
  );
}

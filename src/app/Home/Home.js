"use client";
import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';
import Loder from '../components/Loder';
import { useRouter } from 'next/navigation';
import Header from '../components/Navbar'

export default function Home({ category, subCategory, subSubCategory, searchResults, props}) {
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

        if (subCategory === 'fabric_print_tech' && !subSubCategory) return true;
        if (subCategory === 'fabric_material' && !subSubCategory) return true;
        if (subSubCategory === 'All Fabrics') return true;
        // For 'fabric', check both 'fabricProducts' for 'subCategory' match in 'fabric_print_tech' or 'fabric_material'
        return subCategory ? (product.fabric_print_tech === subSubCategory || product.fabric_material === subSubCategory) : true;
      case 'yarn':
        if (subCategory === 'yarn') return true;
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
      <Header isHomePage={true} />
      {/* Background Image Section */}
      <div className="relative h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url('../Images/cotton fabric.gif')` /*, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'*/ }}>
        <div className="flex flex-col items-baseline justify-center h-full bg-black bg-opacity-60 text-white">
          <h1 className="text-5xl font-bold ml-10 mb-6">Your Gateway to Premium Fabrics and Yarn.</h1>
          <p className="text-3xl mb-3">✦ Seamless Buying and Selling Experience</p>
          <p className="text-3xl mb-3">✦ Exclusive Designs and Quality Materials</p>
          <p className="text-3xl">✦ Trusted by Artisans and Brands Worldwide</p>
        </div>
        {/*<div className="absolute right-0 bottom-0 mr-10 mb-10 w-1/3 h-auto rounded-full">
          <Image src="/Images/Choosing clothes.gif" alt="Choosing clothes" layout="responsive" width={500} height={500} className="rounded-full"/>
        </div>*/}
      </div>
      {/* Product Listing Section */}
      <main className="max-w-screen-xl mx-auto mt-20">
        
        {products.length > 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <select value={sortOrder} onChange={handleSortChange} className="border p-2 rounded">
                <option value="none">Sort by</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="latest">Latest Product</option>
                <option value="oldest">Oldest Product</option>
              </select>
            </div>
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

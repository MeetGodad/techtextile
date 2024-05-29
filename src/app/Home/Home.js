"use client";

import { useEffect, useState } from 'react';
import ProductSection from '../components/ProductSection';
import { useUserAuth } from '../auth/auth-context';

export default function Home() {
  const { user } = useUserAuth(); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/products.json');
      const data = await response.json();
      setProducts(data);
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

  return (
    <div className="w-full h-[1024px] relative bg-white overflow-hidden leading-[normal] tracking-[normal]">
      <main className="absolute top-[108px] left-[84px] w-[1271px] flex flex-col items-start justify-start gap-[37px] max-w-full text-center text-[40px] text-black font-inria-sans">
        <div className="self-stretch flex flex-row items-start justify-center py-0 px-5 box-border max-w-full">
        </div>
        <section className="self-stretch flex flex-row items-start justify-start py-0 px-0 box-border max-w-full">
          <div className="w-[1271px] flex flex-row flex-wrap items-start justify-start gap-[107px_98.3px] min-h-[685px] max-w-full shrink-0">
            {products.map((product) => (
              <ProductSection
                key={product.product_id}
                name={product.product_name}
                price={product.price}
                image={product.image_url}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
          <div className="h-[697px] w-[1318px] flex flex-col items-start justify-start max-w-[104%] shrink-0 ml-[-976px]">
            <div className="w-px flex-1 relative box-border border-r-[1px] border-solid border-black" />
          </div>
          <div className="h-[697px] w-[1317px] flex flex-col items-start justify-start max-w-[104%] shrink-0 ml-[-976px]">
            <div className="w-px flex-1 relative box-border border-r-[1px] border-solid border-black" />
          </div>
          <div className="h-[698px] w-px relative box-border ml-[-976px] border-r-[1px] border-solid border-black" />
        </section>
      </main>
      <div className="absolute top-[526px] left-[86px] box-border w-[1271px] h-px z-[1] border-t-[1px] border-solid border-black" />
      <img
        className="absolute top-[86px] left-[0px] w-[1440px] h-px"
        loading="lazy"
        alt=""
        src="/line-5.svg"/>
    </div>
  );
}

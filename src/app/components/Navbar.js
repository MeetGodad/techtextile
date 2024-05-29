"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    // Initial count
    handleCartUpdate();

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-md fixed top-0 z-50 py-2 px-2 box-border leading-normal tracking-normal">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="relative flex items-center justify-center w-14 h-14">
            <div className="absolute top-1/3 left-1/4 text-2xl transform rotate-[-5.6deg]">T</div>
            <div className="absolute bottom-1/4 right-1/4 text-2xl transform rotate-[5.6deg]">T</div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-30 border-2 border-black w-10 h-10"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-30 border-2 border-black w-10 h-10"></div>
          </div>
          <h3 className="ml-2 text-xl font-bold">TECH TEXTILE</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-200 rounded-md px-2 py-1">
            <input
              type="text"
              placeholder="What are you looking for ?"
              className="bg-transparent outline-none text-sm"
            />
            <img
              className="ml-2 w-4 h-4"
              alt="Search"
              src="/search.svg"
            />
          </div>
          <Link className="font-light text-sm" href="/listProduct">Products</Link>
          <div className="flex items-center gap-4">
            <a href="#" className="font-light text-sm">Home</a>
            <a href="#" className="font-light text-sm">Category</a>
            <a href="#" className="font-light text-sm">About</a>
          </div>
          <Link href="/Cart" passHref>
            <div id="cart-icon" className="relative flex items-center">
              <img
                className="w-4 h-4"
                alt="Cart"
                src="/cart.svg"
              />
              <span className="ml-1 text-sm">Cart</span>
              {cartCount > 0 && (
                <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </div>
              )}
            </div>
          </Link>
          <Link href="/Login" className="font-light text-sm">SignUp/Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

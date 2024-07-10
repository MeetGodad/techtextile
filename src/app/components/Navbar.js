"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserAuth } from '../auth/auth-context';
import { usePathname } from 'next/navigation';
import CategoryDropdown from '../components/Category';


const Header = ({ category, subCategory, subSubCategory, onCategoryChange, onSubCategoryChange, onSubSubCategoryChange,onSearchResults }) => {
  const { user } = useUserAuth();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cart, setCart] = useState([]);
  const router = usePathname();
  const isHomePage = router === '/Home' || router === '/';


  useEffect(() => {

    const fetchCart = async () => {
      try {
        if (user) {
          const userId = user.uid;
          fetch(`/api/cart/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              if (data && typeof data === 'object') {
                setCart(data);
              } else {
                console.error('Server response is not an object:', data);
              }
            })
            .catch(error => {
              console.error('Unexpected server response:', error);
            });
        }
      } catch (error) {
        console.error('Error fetching the cart:', error);
      }
    };

    const handleCartUpdate = () => {
      fetchCart();
    };

    fetchCart();

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const handleSearch = async () => {
    if (!searchText) {
      return;
    }

    try {
      const response = await fetch(`/api/search?term=${searchText}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
      onSearchResults(data); 
      // Navigate to the search results page
      router.push('/search');
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <div className="w-full bg-white overflow-visible flex flex-row items-center gap-80 py-0 px-3 box-border top-0 z-40 sticky leading-normal tracking-normal text-left text-xl text-black font-sans" style={{ borderBottom: '2px solid black' }}>
      <div className="flex items-center">
        <div className="relative flex items-center justify-center w-20 h-20"></div>
        <h3 className="text-4xl font-bold" style={{fontSize: '2.5rem' }}>TECH TEXTILE</h3>
      </div>
      <div className="flex justify-between items-start gap-5">
        <div className="flex w-52 place-items-start bg-gray-200 rounded-md px-6 py-2 min-w-[250px] h-10">
  
    <input
      type="text"
      placeholder="What are you looking for?"
      className="text-left bg-transparent outline-none text-sm"
      onChange={(e) => {
        setSearchText(e.target.value);
      }}
      style={{ width: 'calc(100% - 24px)' }}
    />
    <button
      onClick={() => handleSearch()}
      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
    >
      {searchText === '' ? (
        <img
          className="ml-2 w-8 h-6"
          alt="Search"
          src="/Images/Search.png"
        />
      ) : (
        <img
          className="ml-2 w-8 h-6"
          alt="Clear"
          src="/Images/Search.png" // Assuming you have an icon to clear the search
          onClick={() => setSearchText('')}
        />
      )}
    </button>
  </div>

        <Link className="nav-link font-semibold ml-4" href="/Home">Home</Link>
        {isHomePage && (
          <div className="flex items-center ml-4">
            <CategoryDropdown
              category={category}
              subCategory={subCategory}
              subSubCategory={subSubCategory}
              onCategoryChange={onCategoryChange}
              onSubCategoryChange={onSubCategoryChange}
              onSubSubCategoryChange={onSubSubCategoryChange}
            />
          </div>
        )}
        <Link className="nav-link font-semibold ml-4" href="#">About</Link>
        <Link href="/Cart" className="flex items-center nav-link ml-4">
          <div id="cart-icon" className="relative flex items-center">
            <img className="w-10 h-8" alt="cart" src="/Images/black_cart.png" />
            <span className="ml-2 font-semibold">Cart</span>
            {user && cart.length > 0 && (
              <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </div>
            )}
          </div>
        </Link>
        {user ? (
          <Link href="/Profile" className="nav-link font-semibold ml-4">
            <div className="flex items-center">
              <span className="ml-2">Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/Login" className="nav-link font-semibold ml-4">
            <div className="flex items-center">
              <span className="ml-2">SignUp/Login</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;

// Navbar.js
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserAuth } from '../auth/auth-context';
import { usePathname } from 'next/navigation';
import CategoryDropdown from '../components/Category';
import { RiShoppingBag4Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const Header = ({ category, subCategory, subSubCategory, onCategoryChange, onSubCategoryChange, onSubSubCategoryChange, onSearchResults }) => {
  const { user } = useUserAuth();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cart, setCart] = useState([]);
  const router = usePathname();
  const isHomePage = router === '/Home' || router === '/';
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const response = await fetch(`/api/cart/${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data)) {
              setCart(data);
            } else {
              console.error('Server response is not an array:', data);
            }
          } else {
            console.error('Network response was not ok:', response.statusText);
          } 
        }

      } catch (error) {
        console.error('Error fetching the cart:', error);
      }
    };
  
    fetchCart();
  
    const handleCartUpdate = () => {
      fetchCart();
    };
  
    window.addEventListener('cartUpdated', handleCartUpdate);
  
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);
  

  const handleSearch = async () => {
    try {
      if (!searchText) {
        onSearchResults([]);
        return;
      }
      const response = await fetch(`/api/search?term=${searchText}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      onSearchResults(data);
      // Navigate to the search results page
      router.push('/search');
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const resetSearchResults = () => {
    setSearchText('');
    onSearchResults([]);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  // Set text and background colors based on page and scroll state
  const textColor = isHomePage && !isSticky ? 'text-white' : 'text-black';
  const backgroundColor = isHomePage && !isSticky ? 'bg-transparent' : 'bg-white';


  return (
    <header className={`w-full flex items-center mt-0 gap-80 px-3 box-border z-40 fixed top-0 leading-normal tracking-normal text-xl font-sans  ${backgroundColor} ${isSticky ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="flex flex-auto items-center">
        <div className="flex items-center justify-center w-20 h-20"></div>
        <h3 className={`text-4xl text-center font-bold ${textColor}`} style={{ whiteSpace: 'nowrap', fontSize: 'calc(1.5vw + 1rem)' }}>
          <Link href="/Home" onClick={resetSearchResults}>TECH TEXTILE</Link>
        </h3>
      </div>
      <div className="flex justify-between items-start gap-5">
        <div className="flex w-52 place-items-start bg-gray-200 rounded-md px-6 py-2 min-w-[250px] h-10">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="text-left text-black bg-transparent outline-none text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ width: 'calc(100% - 24px)' }}
          />
          <button
            onClick={() => { handleSearch(); setSearchText(''); }}
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
                src="/Images/Search.png"
                onClick={() => setSearchText('')}
              />
            )}
          </button>
        </div>
        {isHomePage && (
          <div className={`flex items-center ml-4  ${textColor}`}>
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
        <Link className={`nav-link font-semibold ml-4 ${textColor}`} href="/AboutUs">About</Link>
        <Link href="/Cart" className={`flex items-center nav-link ml-4 ${textColor}`}>
          <div id="cart-icon" className="relative flex items-center w-10 h-8">
            <RiShoppingBag4Fill size={45} />
            {user && cart.length > 0 && (
              <div className="bg-red-600 text-white rounded-full text-xs w-7 h-5 flex items-center mb-4 justify-center">
                {cart.length}
              </div>
            )}
          </div>
        </Link>
        {user ? (
          <Link href="/Profile" className={`nav-link font-semibold ml-4 ${textColor}`}>
            <div className="flex items-center">
              <CgProfile size={35} />
            </div>
          </Link>
        ) : (
          <Link href="/Login" className={`nav-link font-semibold ml-4 ${textColor}`}>
            <div className="flex items-center">
              <span className="ml-2">SignUp/Login</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;

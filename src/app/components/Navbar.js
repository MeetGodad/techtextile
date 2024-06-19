"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserAuth } from '../auth/auth-context';


const Header = () => {

  const { user } = useUserAuth();
  const [searchText, setSearchText] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [cart, setCart] = useState([]);


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
    }

    fetchCart();

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  return (

    <div className="w-full bg-white overflow-hidden flex flex-row items-center justify-between py-0 px-3 box-border top-0 z-50 sticky leading-normal tracking-normal gap-3 text-left text-xl text-black font-sans" style={{ borderBottom: '2px solid black' }}>

      <div className="flex items-center">
        <div className="relative flex items-center justify-center w-20 h-20"></div>
        <h3 className="text-4xl font-bold">TECH TEXTILE</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex w-52 place-items-start bg-gray-200 rounded-md px-6 py-2 min-w-[200px] h-10" >
          <input
            type="text"
            placeholder="What are you looking ?"
            className="text-left bg-transparent outline-none text-sm"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 'calc(100% - 24px)' }}
          />
          {searchText === '' && (
          <img
            className="ml-2 w-6 h-6"
            alt="Search"
            src="/Images/Search.png"
          />
          )}
        </div>
        <div className="flex items-center gap-6">
          <a className="nav-link  font-semibold" href="/Home" passHref>Home</a>
          <a className="nav-link  font-semibold" href="#">Category</a>
          <a className="nav-link  font-semibold" href="#">About</a>
        </div>
        <Link href="/Cart">
          <div className="flex items-center nav-link">
          <div id="cart-icon" className="relative flex items-center">
            <img
              className="w-10 h-8"
              alt="cart"
              src="/Images/black_cart.png"
            />
            <span className="ml-2 font-semibold">Cart</span>  
            {console.log("cart", cart)}
            {user && cart.length > 0 && (
              console.log("cart", cart.length),
              <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cart.length}
              </div>
            )}
          </div>
          </div>
        </Link>
        {user ? (
          <Link href="/Profile">

            <div className="flex items-center nav-link">

              <span className="ml-2 font-semibold">Visit Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/Login" >
            <div className="flex items-center nav-link">
              <span className=" font-semibold">SignUp/Login</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;

import React from 'react';
<<<<<<< Updated upstream
=======
import Link from 'next/link';
>>>>>>> Stashed changes

const Header = () => {
  return (
    <div className="w-full bg-white overflow-hidden flex flex-row items-center justify-between py-3 px-4 box-border top-0 z-99 sticky leading-normal tracking-normal gap-4 text-left text-xl text-black font-sans">
      <div className="flex items-center">
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute top-1/3 left-1/4 text-3xl transform rotate-[-5.6deg]">T</div>
          <div className="absolute bottom-1/4 right-1/4 text-3xl transform rotate-[5.6deg]">T</div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-30 border-2 border-black w-14 h-14"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-30 border-2 border-black w-14 h-14"></div>
        </div>
        <h3 className="ml-4 text-2xl font-bold">TECH TEXTILE</h3>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center bg-gray-200 rounded-md px-3 py-1">
          <input
            type="text"
            placeholder="What are you looking for ?"
            className="bg-transparent outline-none"
          />
          <img
            className="ml-2 w-6 h-6"
            alt="Search"
            src="/search.svg"
          />
        </div>
        <div className="flex items-center gap-6">
                    <a href="#" className="font-light">Home</a>
                    <a href="#" className="font-light">Category</a>
                    <a href="#" className="font-light">About</a>
                </div>
<<<<<<< Updated upstream
                <div className="flex items-center">
                    <button className="bg-transparent p-2">
                        <img
                            className="w-8 h-8"
                            alt="Cart"
                            src="/shopping-cart@2x.png"
                        />
                    </button>
                    <a href="/Login" className="ml-2 font-bold">SIGN UP/LOG IN</a>
                </div>
            </div>
        </div>
    );
=======
        <Link href="/Cart" passHref>
          <div className="flex items-center">
            <img
              className="w-6 h-6"
              alt="Cart"
              src="/cart.svg"
            />
            <span className="ml-2">Cart</span>
          </div>
        </Link>
        <Link href="/Login"> SignUp/Login </Link>
      </div>
    </div>
  );
>>>>>>> Stashed changes
};

export default Header;

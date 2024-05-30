"Use client";
import React from 'react';
import Link from 'next/link';
import { useUserAuth } from '../auth/auth-context';
import { useEffect , useState} from 'react';

const Header = () => {
  const { user } = useUserAuth();
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="w-full bg-white overflow-hidden flex flex-row items-center justify-between py-0 px-3 box-border top-0 z-99 sticky leading-normal tracking-normal gap-3 text-left text-xl text-black font-sans" style={{ borderBottom: '2px solid black' }}>
      <div className="flex items-center">
        <div className="relative flex items-center justify-center w-20 h-20"></div>
        <h3 className="text-4xl font-bold">TECH TEXTILE</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex place-items-start bg-gray-200 rounded-md px-6 py-2 min-w-[200px] h-10" style={{ minWidth: '200px', height: '40px' }}>
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
        <Link className="nav-link font-light font-semibold" href="/listProduct">Products</Link>
        <div className="flex items-center gap-6">
          <a className="nav-link font-light font-semibold" href="/Home" passHref>Home</a>
          <a className="nav-link font-light font-semibold" href="#">Category</a>
          <a className="nav-link font-light font-semibold" href="#">About</a>
        </div>
        <Link href="/Cart" passHref>
          <div className="flex items-center nav-link">
            <img
              className="w-10 h-8"
              alt="cart"
              src="/Images/black_cart.png"
            />
            <span className="ml-2 font-semibold">Cart</span>
          </div>
        </Link>
        {user ? (
          <Link href="/Profile" passHref>
            <div className="flex items-center nav-link">
              <span className="ml-2">Visit Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/Login" passHref>
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

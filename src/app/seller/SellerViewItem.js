// import React from 'react';
// import Header from '../components/Navbar';
// import Foooter from '../components/Footer';

// const SellerViewItem = () => {
//   return (
//     <div >
//       <Header />
//       <h1>Item page </h1>
//       <Foooter />
//     </div>
//   );
// };

// export default SellerViewItem;
// // 
"use client"
import React, { useState, useEffect } from 'react';
import Header from '../components/Navbar';
import Footer from '../components/Footer';
import { useUserAuth } from '../auth/auth-context';
import { Link } from 'react-router-dom';

const SellerViewItem = () => {
  const [items, setItems] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchItems = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/products?sellerId=${user.uid}`);
          const data = await response.json();
          setItems(data.items || []);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      }
    };
    fetchItems();
  }, [user]);

  return (
    <div className="w-full bg-white flex flex-col items-start justify-start pt-0 px-0 pb-[166.4px] box-border gap-[108px]">
      <Header />
      <section className="w-[1408px] flex flex-col items-start justify-start py-0 px-5 box-border max-w-full text-center text-[40px] text-black font-inter">
        <div className="self-stretch flex flex-col items-start justify-start gap-[20px]">
          <h1 className="text-inherit font-bold">Listed Items</h1>
          <input
            type="text"
            placeholder="Search Items"
            className="w-full py-2 px-3 border border-gray-300 rounded-md"
          />
          <div className="self-stretch flex flex-col items-start justify-start gap-[10.5px]">
            <div className="flex flex-row items-start justify-between py-0 px-5 max-w-full text-left text-mini">
              <span>Description</span>
              <span>Category</span>
              <span>Variant</span>
              <span>Price</span>
              <span>Actions</span>
            </div>
            {items.map(item => (
              <div key={item.id} className="flex flex-row items-start justify-between py-2 px-5 border-b border-gray-300 max-w-full">
                <img src={item.image} alt={item.description} className="h-[63.8px] w-[95px] object-cover rounded-md" />
                <span>{item.description}</span>
                <span>{item.category}</span>
                <span>{item.variant}</span>
                <span>${item.price}</span>
                <div className="flex flex-row items-start justify-start gap-[15px] text-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  <Link to="/UpdateItem">Update</Link>
                  <Link to="./edititem/page.js">Update</Link>
                </button>                  
                <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">Add Item</button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SellerViewItem;

"use client";
import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import PurchasedItems from './PurchasedItems';
import SellerViewItem from '../seller/SellerViewItem';
import ListProduct from '../seller/ListProduct';

export default function Adminpage() {
  const { user } = useUserAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showListedItems, setShowListedItems] = useState(true); // Set View Listed Items as default
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showPurchasedItems, setShowPurchasedItems] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/Home');
    }
  }, [user, router]);

  const handleViewListedItems = () => {
    setShowListedItems(true);
    setShowAddProduct(false);
    setShowPurchasedItems(false);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
    setShowListedItems(false);
    setShowPurchasedItems(false);
  };

  const handleShowPurchasedItems = () => {
    setShowPurchasedItems(true);
    setShowListedItems(false);
    setShowAddProduct(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className={`transition-transform duration-500 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0`}>
        <button onClick={() => setSidebarVisible(!sidebarVisible)} className="text-white absolute top-4 right-4 lg:hidden">
          {sidebarVisible ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <nav>
          <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
          <ul>
            <li>
              <button onClick={handleViewListedItems} className={`block py-2.5 px-4 rounded transition duration-200 ${showListedItems ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                View Listed Items
              </button>
            </li>
            <li>
              <button onClick={handleAddProduct} className={`block py-2.5 px-4 rounded transition duration-200 ${showAddProduct ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                Add Product
              </button>
            </li>
            <li>
              <button onClick={handleShowPurchasedItems} className={`block py-2.5 px-4 rounded transition duration-200 ${showPurchasedItems ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                Purchased Items
              </button>
            </li>
            <li>
              <button onClick={() => router.push('/Profile')} className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-200">
                Back to Profile
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-10">
        <div className={`transition-opacity duration-500 ${showListedItems ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {showListedItems && user && (
            <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
              <SellerViewItem userId={user.uid} />
            </aside>
          )}
        </div>

        <div className={`transition-opacity duration-500 ${showAddProduct ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {showAddProduct && user && (
            <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
              <ListProduct userId={user.uid} />
            </aside>
          )}
        </div>

        <div className={`transition-opacity duration-500 ${showPurchasedItems ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {showPurchasedItems && (
            <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
              <PurchasedItems userId={user.uid} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}


// "use client";
// import React, { useEffect, useState } from 'react';
// import { useUserAuth } from '../auth/auth-context';
// import { FiMenu, FiX } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';
// import SellerViewItem from '../seller/SellerViewItem';
// import ListProduct from '../seller/ListProduct';

// export default function Adminpage() {
//   const { user } = useUserAuth();
//   const [sidebarVisible, setSidebarVisible] = useState(true);
//   const [showListedItems, setShowListedItems] = useState(true); // Set View Listed Items as default
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push('/Home');
//     }
//   }, [user, router]);

//   const handleViewListedItems = () => {
//     setShowListedItems(true);
//     setShowAddProduct(false);
//   };

//   const handleAddProduct = () => {
//     setShowAddProduct(true);
//     setShowListedItems(false);
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       <aside className={`transition-transform duration-500 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0`}>
//         <button onClick={() => setSidebarVisible(!sidebarVisible)} className="text-white absolute top-4 right-4 lg:hidden">
//           {sidebarVisible ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//         <nav>
//           <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
//           <ul>
//             <li>
//               <button onClick={handleViewListedItems} className={`block py-2.5 px-4 rounded transition duration-200 ${showListedItems ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
//                 View Listed Items
//               </button>
//             </li>
//             <li>
//               <button onClick={handleAddProduct} className={`block py-2.5 px-4 rounded transition duration-200 ${showAddProduct ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
//                 Add Product
//               </button>
//             </li>
//             <li>
//               <button onClick={() => router.push('/Profile')} className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-200">
//                 Back to Profile
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//       <div className="flex-1 p-10">
//         <div className={`transition-opacity duration-500 ${showListedItems ? 'opacity-100' : 'opacity-0 hidden'}`}>
//           {showListedItems && user && (
//             <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
//               <SellerViewItem userId={user.uid} />
//             </aside>
//           )}
//         </div>

//         <div className={`transition-opacity duration-500 ${showAddProduct ? 'opacity-100' : 'opacity-0 hidden'}`}>
//           {showAddProduct && user && (
//             <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
//               <ListProduct userId={user.uid} />
//             </aside>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

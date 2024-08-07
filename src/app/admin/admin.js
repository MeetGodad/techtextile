"use client";
import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import PurchasedItems from './PurchasedItems';
import SellerViewItem from '../seller/SellerViewItem';
import ListProduct from '../seller/ListProduct';
import BusinessStats from './BusinessStats';
import ProductReviews from './ProductReviews';

export default function Adminpage() {
  const { user } = useUserAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showListedItems, setShowListedItems] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showPurchasedItems, setShowPurchasedItems] = useState(false);
  const [showBusinessStats, setShowBusinessStats] = useState(true);
  const [showProductReviews, setShowProductReviews] = useState(false);
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
    setShowBusinessStats(false);
    setShowProductReviews(false);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
    setShowListedItems(false);
    setShowPurchasedItems(false);
    setShowBusinessStats(false);
    setShowProductReviews(false);
  };

  const handleShowPurchasedItems = () => {
    setShowPurchasedItems(true);
    setShowListedItems(false);
    setShowAddProduct(false);
    setShowBusinessStats(false);
    setShowProductReviews(false);
  };

  const handleViewBusinessStats = () => {
    setShowBusinessStats(true);
    setShowPurchasedItems(false);
    setShowListedItems(false);
    setShowAddProduct(false);
    setShowProductReviews(false);
  };

  const handleShowProductReviews = () => {
    setShowProductReviews(true);
    setShowBusinessStats(false);
    setShowPurchasedItems(false);
    setShowListedItems(false);
    setShowAddProduct(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className={`transition-transform duration-500 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} bg-gradient-to-r from-black to-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0`}>
        <button onClick={() => setSidebarVisible(!sidebarVisible)} className="text-white absolute top-4 right-4 lg:hidden">
          {sidebarVisible ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <nav>
          <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
          <ul className="space-y-2">
            <li>
              <button onClick={handleViewBusinessStats} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${showBusinessStats ? 'bg-gradient-to-r from-gray-700 to-black' : 'hover:bg-gray-600'}`}>
                View Business Stats
              </button>
            </li>
            <li>
              <button onClick={handleViewListedItems} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${showListedItems ? 'bg-gradient-to-r from-gray-700 to-black' : 'hover:bg-gray-600'}`}>
                View Listed Items
              </button>
            </li>
            <li>
              <button onClick={handleAddProduct} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${showAddProduct ? 'bg-gradient-to-r from-gray-700 to-black' : 'hover:bg-gray-600'}`}>
                Add Product
              </button>
            </li>
            <li>
              <button onClick={handleShowPurchasedItems} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${showPurchasedItems ? 'bg-gradient-to-r from-gray-700 to-black' : 'hover:bg-gray-600'}`}>
                Purchased Items
              </button>
            </li>
            <li>
              <button onClick={handleShowProductReviews} className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 ${showProductReviews ? 'bg-gradient-to-r from-gray-700 to-black' : 'hover:bg-gray-600'}`}>
                Product Reviews
              </button>
            </li>
            <li>
              <button onClick={() => router.push('/Profile')} className="block w-full text-left py-2.5 px-4 rounded hover:bg-gray-600 transition duration-200">
                Back to Profile
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-10">
        {user && (
          <>
            <div className={`transition-opacity duration-500 ${showBusinessStats ? 'opacity-100' : 'opacity-0 hidden'}`}>
              {showBusinessStats && (
                <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
                  <BusinessStats userId={user.uid} onShowPurchasedItems={handleShowPurchasedItems} />
                </aside>
              )}
            </div>

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

            <div className={`transition-opacity duration-500 ${showProductReviews ? 'opacity-100' : 'opacity-0 hidden'}`}>
              {showProductReviews && (
                <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
                  <ProductReviews userId={user.uid} />
                </aside>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

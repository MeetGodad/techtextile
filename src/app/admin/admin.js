"use client";
import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import PurchasedItems from './PurchasedItems';

export default function Adminpage() {
  const { user } = useUserAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/Home');
    }
  }, [user, router]);

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
              <button className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                Business Stats
              </button>
            </li>
            <li>
              <button className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                Product Reviews
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
      <div className="flex-1 p-10 text-2xl font-bold">
        <PurchasedItems userId={user?.uid} />
      </div>
    </div>
  );
}

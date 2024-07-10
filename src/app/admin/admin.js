"use client";
import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import PurchasedItems from './PurchasedItems';

export default function AdminPage() {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/admin/${user.uid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch items');
          }
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      }
    };

    fetchItems();
  }, [user]);

  return (
    <div className="w-full min-h-screen p-8 text-black relative">
      <section className="max-w-screen-xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Purchased Items</h1>
        </div>
        <PurchasedItems items={items} />
      </section>
    </div>
  );
}

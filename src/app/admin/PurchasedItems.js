"use client";
import { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';

const PurchasedItems = () => {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/api/seller/${user.uid}/purchased-items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setItems(data);
        })
        .catch((error) => {
          console.error('Error fetching purchased items:', error);
        });
    }
  }, [user]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {items.length === 0 ? (
        <div className="py-2 text-center text-gray-500">No items found</div>
      ) : (
        items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative transition transform hover:scale-105">
            <img src={item.image_url} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">{item.product_name}</h2>
              <p className="text-gray-600 mt-2">${item.price}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PurchasedItems;

// Refrence - From SellerViewItem.js file
"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
import OrderDetails from './OrderDetails';

const PurchaseHistory = ({ userId, onClose }) => {
  const [purchases, setPurchases] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`/api/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPurchases(data);
          } else {
            console.error('Fetched data is not an array:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching purchase history:', error);
        });
    }
  }, [userId]);

  const handleViewItem = (purchase) => {
    setSelectedOrder(purchase);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 text-black relative">
      <h2 className="text-2xl font-bold mb-6 text-center">Purchase History</h2>
      {purchases.length === 0 ? (
        <div className="py-2 text-center text-gray-500">No purchase history found</div>
      ) : (
        <section className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {purchases.map((purchase, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative transition transform hover:scale-105">
                {purchase.image_url ? (
                  <img src={purchase.image_url.split(',')[0]} alt={purchase.product_name} className="h-48 w-full object-cover rounded-t-lg" />
                ) : (
                  <div className="h-48 w-full bg-gray-300 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-800">{purchase.product_name}</h2>
                  <p className="text-gray-600 mt-2">${purchase.price}</p>
                  <button
                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    onClick={() => handleViewItem(purchase)}
                  >
                    View Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {selectedOrder && (
        <OrderDetails
          userId={userId}
          orderId={selectedOrder.order_id}
          productId={selectedOrder.product_id}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default PurchaseHistory;


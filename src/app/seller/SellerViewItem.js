"use client"
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
import DeleteListedItem from './DeleteListedItem';
import UpdateProduct from './UpdateProduct';

const SellerViewItem = () => {
  const [items, setItems] = useState([]);
  const { user } = useUserAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, prevTop: 0 });
  const [updateItem, setUpdateItem] = useState(null);

  useEffect(() => {
    fetchProducts();

    const handleFetchSellerData = () => {
      fetchProducts();
      console.log('Seller data updated with EventListener');
    }

    window.addEventListener('sellerDataUpdated', handleFetchSellerData);

    return () => {
      window.removeEventListener('sellerDataUpdated', handleFetchSellerData);
    }

  }, [user]);

  const fetchProducts = async () => {
    try {
      if (user) {
        const userId = user.uid;
        fetch(`/api/seller/${userId}`, {
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
              setItems(data);
            } else {
              console.error('Server response is not an object:', data);
            }
          })
          .catch(error => {
            console.error('Unexpected server response:', error);
          });
      }
    } catch (error) {
      console.error('Error fetching the items:', error);
    }
  };

  const handleDeleteSuccess = () => {
    setSelectedItem(null);
    fetchProducts();
  };

  const handleRemoveClick = (item, event) => {
    const rect = event.target.getBoundingClientRect();
    const prevTop = window.scrollY;
    setPopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX, prevTop });
    setSelectedItem(item);
  };

  const handleUpdateClick = (item, event) => {
    const rect = event.target.getBoundingClientRect();
    const prevTop = window.scrollY;
    setPopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX, prevTop });
    setUpdateItem(item);
  };

  return (
    <div className={`w-full min-h-screen p-8 text-black relative`}>
      {selectedItem && (
        <DeleteListedItem 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)}
          onDeleteSuccess={handleDeleteSuccess}
          position={popupPosition}
        />
      )}
      {updateItem && (
        <UpdateProduct
          product={updateItem}
          onUpdateSuccess={() => {
            setUpdateItem(null);
            fetchProducts();
          }}
          onClose={() => setUpdateItem(null)}
          position={popupPosition}
        />
      )}
      <section className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Listed Items</h1>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between text-left text-sm font-medium">
            <span>Image</span>
            <span>Product Name</span>
            <span>Description</span>
            <span>Price</span>
            <span>Actions</span>
          </div>
          {items.length === 0 ? (
            <div className="py-2">No items found</div>
          ) : (
            items.map((item, index) => (
              <div key={item.product_id} className="flex justify-between items-center py-2 border-b border-gray-300">
                <img src={item.image_url} alt={item.product_description} className="h-16 w-24 object-cover rounded-md" />
                <span>{item.product_description}</span>
                <span>{item.product_type}</span>
                <span>{item.variant}</span>
                <span>${item.price}</span>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={(event) => handleUpdateClick(item, event)}>Update</button>
                  <button onClick={(event) => handleRemoveClick(item, event)} className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md shadow-md">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <button onClick={() => window.location.href='/listProduct'} className="mt-8 mb-12 px-4 py-2 bg-green-500 text-white rounded-md">
          Add Item
        </button>   
      </section>
    </div>
  );
};

export default SellerViewItem;

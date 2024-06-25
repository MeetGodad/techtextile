"use client"
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
import DeleteListedItem from './DeleteListedItem';
import UpdateProduct from './UpdateProduct';
import ProductDetails from './ProductDetails';

const SellerViewItem = () => {
  const [items, setItems] = useState([]);
  const { user } = useUserAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, prevTop: 0 });
  const [updateItem, setUpdateItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);

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

  const handleDetailsClick = (item, event) => {
    const rect = event.target.getBoundingClientRect();
    const prevTop = window.scrollY;
    setPopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX, prevTop });
    setDetailsItem(item);
  };

  const handleRemove = (item) => {
    setDetailsItem(null);
    setSelectedItem(item);
  };

  const handleUpdate = (item) => {
    setDetailsItem(null);
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
      {detailsItem && (
        <ProductDetails
          product={detailsItem}
          onClose={() => setDetailsItem(null)}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
          position={popupPosition}
        />
      )}
      <section className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Listed Items</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.length === 0 ? (
            <div className="py-2">No items found</div>
          ) : (
            items.map((item, index) => (
              <div key={item.product_id} className="bg-white rounded-lg shadow-md p-4 relative">
                <img src={item.image_url} alt={item.product_description} className="h-48 w-full object-cover rounded-t-md" />
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">{item.product_name}</h2>
                  <p className="text-gray-700 mt-2">${item.price}</p>
                  <button
                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    onClick={(event) => handleDetailsClick(item, event)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default SellerViewItem;

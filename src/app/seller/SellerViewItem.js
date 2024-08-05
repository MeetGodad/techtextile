"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
import DeleteListedItem from './DeleteListedItem';
import UpdateProduct from './UpdateProduct';
import ProductDetails from './ProductDetails';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SellerViewItem = ({ userId }) => {
  const [items, setItems] = useState([]);
  const { user } = useUserAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, prevTop: 0 });
  const [updateItem, setUpdateItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('name-asc');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();

    const handleFetchSellerData = () => {
      fetchProducts();
      console.log('Seller data updated with EventListener');
    };

    window.addEventListener('sellerDataUpdated', handleFetchSellerData);

    return () => {
      window.removeEventListener('sellerDataUpdated', handleFetchSellerData);
    };
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
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
            setLoading(false);
          })
          .catch(error => {
            console.error('Unexpected server response:', error);
            setError('Error fetching items. Please try again later.');
            setLoading(false);
          });
      }
    } catch (error) {
      console.error('Error fetching the items:', error);
      setError('Error fetching items. Please try again later.');
      setLoading(false);
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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortItems = (items) => {
    switch (sortOption) {
      case 'name-asc':
        return items.sort((a, b) => a.product_name.localeCompare(b.product_name));
      case 'name-desc':
        return items.sort((a, b) => b.product_name.localeCompare(a.product_name));
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price);
      default:
        return items;
    }
  };

  const filteredItems = sortItems(
    items.filter(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full min-h-screen p-8 text-black bg-white relative">
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black">Listed Items</h1>
        </div>
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            className="p-2 border border-black rounded-lg w-full max-w-md font-bold"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="p-2 border border-black rounded-lg font-bold"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="price-asc">Sort by Price (Low to High)</option>
            <option value="price-desc">Sort by Price (High to Low)</option>
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredItems.length === 0 ? (
              <div className="py-2 text-center text-gray-500">No items found</div>
            ) : (
              filteredItems.map((item) => {
                const isDeleted = item.variants.every(variant => variant.quantity === 0);
                return (
                  <div 
                    key={item.product_id} 
                    className={`bg-white rounded-lg shadow-lg relative flex flex-col justify-between transition transform hover:scale-105 ${isDeleted ? 'opacity-50' : ''}`}
                    title={isDeleted ? 'This product is marked as deleted' : ''}
                  >
                    <img src={item.image_url.split(',')[0]} alt={item.product_name} className="h-48 w-full object-contain rounded-t-lg" />
                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="text-lg font-semibold text-black">{item.product_name}</h2>
                      <p className="text-gray-700 mt-2">${item.price}</p>
                      <button
                        className="mt-auto bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition duration-300"
                        onClick={(event) => handleDetailsClick(item, event)}
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default SellerViewItem;

import React, { useState } from 'react';
import PurchasedItemDetails from './PurchasedItemDetails';

const PurchasedItems = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {items.length === 0 ? (
        <div className="py-2 text-center text-gray-500">No items found</div>
      ) : (
        items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative transition transform hover:scale-105">
            <img src={item.image_url.split(',')[0]} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">{item.product_name}</h2>
              <p className="text-gray-600 mt-2">${item.price}</p>
              <button
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={() => handleViewDetails(item)}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
      {selectedItem && (
        <PurchasedItemDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default PurchasedItems;

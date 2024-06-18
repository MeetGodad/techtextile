"use client"
import React, { useState } from 'react';

const DeleteListedItem = ({ item, onClose, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/seller/${item.product_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete the item');
      }

      onDeleteSuccess(); // Call the success handler from the parent component
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Delete Item</h2>
        <p className="mb-4">Are you sure you want to delete this item?</p>
        <div className="mb-4">
          <img src={item.image_url} alt={item.product_description} className="h-16 w-24 object-cover rounded-md mb-2" />
          <p><strong>Product Name:</strong> {item.product_description}</p>
          <p><strong>Description:</strong> {item.product_type}</p>
          <p><strong>Variant:</strong> {item.variant}</p>
          <p><strong>Price:</strong> ${item.price}</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListedItem;

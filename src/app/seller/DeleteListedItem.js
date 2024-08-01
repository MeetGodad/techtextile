"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const DeleteListedItem = ({ item, onClose, onDeleteSuccess, position }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('');

  useEffect(() => {
    window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
  }, [position]);

  const handleDelete = async (isVariant = false) => {
    if (isVariant && selectedVariant === '') {
      MySwal.fire({
        title: 'Error',
        text: 'Please select a variant first',
        icon: 'error',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `/api/seller/${item.product_id}`;
      if (isVariant) {
        url += `?variantId=${selectedVariant}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove the item');
      }

      MySwal.fire({
        title: 'Success',
        text: isVariant ? 'Variant deleted successfully' : 'Product deleted successfully',
        icon: 'success',
      });

      onDeleteSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
    onClose();
  };

  const getColorFromVariantAttributes = (attributes) => {
    const colorAttr = attributes.split(',').find(attr => attr.trim().startsWith('Color:'));
    if (colorAttr) {
      return colorAttr.split(':')[1].trim();
    }
    return '';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Remove Item</h2>
        <p className="mb-4">Are you sure you want to remove this item?</p>
        <div className="mb-4">
          <img src={item.image_url.split(',')[0]} alt={item.product_description} className="h-16 w-24 object-cover rounded-md mb-2" />
          <p><strong>Product Name:</strong> {item.product_name}</p>
          <p><strong>Description:</strong> {item.product_description}</p>
          <p><strong>Price:</strong> ${item.price}</p>
          <div className="mt-2 flex flex-wrap">
            {item.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(variant.variant_id)}
                className={`w-8 h-8 rounded-full m-1 ${selectedVariant === variant.variant_id ? 'border-2 border-blue-500' : ''}`}
                style={{ backgroundColor: getColorFromVariantAttributes(variant.attributes) }}
              />
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-between space-x-2">
          <button
            onClick={() => handleDelete(false)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700 shadow-md"
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove Product'}
          </button>
          <button
            onClick={() => handleDelete(true)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-md shadow-md"
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove Variant'}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListedItem;

"use client";
import React, { useEffect } from 'react';

const ProductDetails = ({ product, onClose, onRemove, onUpdate, position }) => {
  useEffect(() => {
    window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
  }, [position]);

  const handleClose = () => {
    window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out"
      >
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="mb-4">
          <img src={product.image_url} alt={product.product_description} className="h-48 w-full object-cover rounded-md mb-2" />
          <p><strong>Product Name:</strong> {product.product_name}</p>
          <p><strong>Description:</strong> {product.product_description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Product Type:</strong> {product.product_type}</p>
          {product.product_type === 'yarn' && (
            <>
              <p><strong>Yarn Material:</strong> {product.yarn_material}</p>
              <p><strong>Yarn Denier:</strong> {product.yarn_denier}</p>
              <p><strong>Yarn Colors:</strong> {product.yarn_color}</p>
            </>
          )}
          {product.product_type === 'fabric' && (
            <>
              <p><strong>Fabric Print Tech:</strong> {product.fabric_print_tech}</p>
              <p><strong>Fabric Material:</strong> {product.fabric_material}</p>
              <p><strong>Fabric Colors:</strong> {product.fabric_color}</p>
            </>
          )}
        </div>
        {product.error && <p className="text-red-500 mb-4">{product.error}</p>}
        <div className="flex space-x-4">
        <button onClick={() => onUpdate(product)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Update</button>
          <button onClick={() => onRemove(product)} className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-md shadow-md">Remove</button>
          <button onClick={handleClose} className="px-6 py-2 bg-gray-500 text-white rounded-md">Close</button>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
// // Refrence - https://chatgpt.com/c/5f947589-837e-403b-8027-58a129d2d590

// "use client";
// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

// const DeleteListedItem = ({ item, onClose, onDeleteSuccess, position }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState('');

//   useEffect(() => {
//     window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
//   }, [position]);

//   const handleDelete = async (isVariant = false) => {
//     if (isVariant && selectedVariant === '') {
//       MySwal.fire({
//         title: 'Error',
//         text: 'Please select a variant first',
//         icon: 'error',
//       });
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       let url = `/api/seller/${item.product_id}`;
//       if (isVariant) {
//         url += `?variantId=${selectedVariant}`;
//       }

//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Failed to remove the item');
//       }

//       MySwal.fire({
//         title: 'Success',
//         text: isVariant ? 'Variant deleted successfully' : 'Product deleted successfully',
//         icon: 'success',
//       });

//       onDeleteSuccess();
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
//     onClose();
//   };

//   const getColorFromVariantAttributes = (attributes) => {
//     const colorAttr = attributes.split(',').find(attr => attr.trim().startsWith('Color:'));
//     if (colorAttr) {
//       return colorAttr.split(':')[1].trim();
//     }
//     return '';
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="fixed inset-0 bg-black bg-opacity-50"></div>
//       <div className="relative bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-4">Remove Item</h2>
//         <p className="mb-4">Are you sure you want to remove this item?</p>
//         <div className="mb-4">
//           <img src={item.image_url.split(',')[0]} alt={item.product_description} className="h-16 w-24 object-cover rounded-md mb-2" />
//           <p><strong>Product Name:</strong> {item.product_name}</p>
//           <p><strong>Description:</strong> {item.product_description}</p>
//           <p><strong>Price:</strong> ${item.price}</p>
//           <div className="mt-2 flex flex-wrap">
//             {item.variants.map((variant, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedVariant(variant.variant_id)}
//                 className={`w-8 h-8 rounded-full m-1 ${selectedVariant === variant.variant_id ? 'border-2 border-blue-500' : ''}`}
//                 style={{ backgroundColor: getColorFromVariantAttributes(variant.attributes) }}
//               />
//             ))}
//           </div>
//         </div>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <div className="flex justify-between space-x-2">
//           <button
//             onClick={() => handleDelete(false)}
//             className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700 shadow-md"
//             disabled={loading}
//           >
//             {loading ? 'Removing...' : 'Remove Product'}
//           </button>
//           <button
//             onClick={() => handleDelete(true)}
//             className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-md shadow-md"
//             disabled={loading}
//           >
//             {loading ? 'Removing...' : 'Remove Variant'}
//           </button>
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteListedItem;

"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const DeleteListedItem = ({ item, onClose, onDeleteSuccess, position }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState(new Set());
  const [selectedDeniers, setSelectedDeniers] = useState(new Set());

  useEffect(() => {
    window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
  }, [position]);

  const handleDelete = async (isVariant = false) => {
    if (isVariant && selectedDeniers.size === 0 && selectedVariants.size === 0) {
      MySwal.fire({
        title: 'Error',
        text: 'Please select a variant or denier first',
        icon: 'error',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url = `/api/seller/${item.product_id}`;

      if (selectedDeniers.size > 0) {
        url += `?denierIds=${Array.from(selectedDeniers).join(',')}`;
      } else if (selectedVariants.size > 0) {
        url += `?variantIds=${Array.from(selectedVariants).join(',')}`;
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
        text: isVariant ? 'Selected variants/deniers deleted successfully' : 'Product deleted successfully',
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
    if (!attributes) return '';
    const colorAttr = attributes.split(',').find(attr => attr.trim().startsWith('Color:'));
    if (colorAttr) {
      return colorAttr.split(':')[1].trim();
    }
    return '';
  };

  const handleVariantSelection = (variantId) => {
    setSelectedVariants(prevState => {
      const newState = new Set(prevState);
      if (newState.has(variantId)) {
        newState.delete(variantId);
      } else {
        newState.add(variantId);
      }
      return newState;
    });
  };

  const handleDenierSelection = (denierId) => {
    setSelectedDeniers(prevState => {
      const newState = new Set(prevState);
      if (newState.has(denierId)) {
        newState.delete(denierId);
      } else {
        newState.add(denierId);
      }
      return newState;
    });
  };

  const groupedVariants = item.variants.reduce((acc, variant) => {
    const attributes = {};
    variant.variant_attributes.split(', ').forEach(attr => {
      const [key, value] = attr.split(': ');
      attributes[key.trim()] = value.trim();
    });

    const color = attributes.Color;
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push({ ...attributes, variant_id: variant.variant_id, quantity: variant.quantity, deniers: variant.deniers });
    return acc;
  }, {});

  const isProductFullySelected = () => {
    return Object.keys(groupedVariants).every(color => {
      return groupedVariants[color].every(variant => selectedVariants.has(variant.variant_id));
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-8">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-3xl w-full overflow-y-auto"
        style={{ maxHeight: '90vh' }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Remove Item</h2>
        <p className="mb-4 text-center">Are you sure you want to remove this item?</p>
        <div className="mb-6 text-center">
          <img src={item.image_url.split(',')[0]} alt={item.product_description} className="h-32 w-32 object-cover rounded-md mx-auto mb-4" />
          <p><strong>Product Name:</strong> {item.product_name}</p>
          <p><strong>Description:</strong> {item.product_description}</p>
          <p><strong>Price:</strong> ${item.price}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold">Variants:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {Object.keys(groupedVariants).map((color, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full border-2 mr-2" style={{ backgroundColor: color }}></div>
                  <span className="font-semibold">{color}</span>
                </div>
                {groupedVariants[color].map((variant, variantIndex) => (
                  <div key={variantIndex} className="mb-4">
                    <div
                      className={`p-2 border rounded cursor-pointer flex items-center space-x-2 ${selectedVariants.has(variant.variant_id) ? 'border-blue-500' : 'border-gray-300'}`}
                      onClick={() => handleVariantSelection(variant.variant_id)}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                      <div>
                        <p className="text-sm"><span className="font-semibold">Denier:</span> {variant.Denier}</p>
                        <p className="text-sm"><span className="font-semibold">Quantity:</span> {variant.quantity}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {variant.deniers && variant.deniers.map((denier, denierIndex) => (
                        <div
                          key={denierIndex}
                          className={`p-2 border rounded cursor-pointer flex items-center space-x-2 ${selectedDeniers.has(denier.denier_id) ? 'border-blue-500' : 'border-gray-300'}`}
                          onClick={(e) => { e.stopPropagation(); handleDenierSelection(denier.denier_id); }}
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                          <div>
                            <p className="text-sm"><span className="font-semibold">Denier:</span> {denier.denier}</p>
                            <p className="text-sm"><span className="font-semibold">Quantity:</span> {denier.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="flex justify-between space-x-2 mt-4">
          <button
            onClick={() => handleDelete(false)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700 shadow-md"
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove Product'}
          </button>
          <button
            onClick={() => handleDelete(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-md hover:from-indigo-500 hover:to-indigo-700 shadow-md"
            disabled={loading}
          >
            {loading ? 'Removing...' : 'Remove Variant/Denier'}
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListedItem;

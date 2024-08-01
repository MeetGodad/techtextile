// "use client";
// import React, { useEffect, useState } from 'react';

// const ProductDetails = ({ product, onClose, onRemove, onUpdate, position }) => {
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   useEffect(() => {
//     window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
//   }, [position]);

//   const handleClose = () => {
//     window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
//     onClose();
//   };

//   const handleReadMoreToggle = () => {
//     setShowFullDescription(!showFullDescription);
//   };

//   const descriptionWords = product.product_description ? product.product_description.split(' ') : [];
//   let shortDescription = '';
//   let wordCount = 0;

//   for (let word of descriptionWords) {
//     if (wordCount + word.length + 1 > 88) break; // +1 for the space
//     shortDescription += word + ' ';
//     wordCount += word.length + 1;
//   }
//   shortDescription = shortDescription.trim();
//   const isLongDescription = product.product_description && product.product_description.length > shortDescription.length;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="fixed inset-0 bg-black bg-opacity-75"></div>
//       <div
//         className="relative bg-white text-black p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-md overflow-y-auto"
//         style={{ maxHeight: '90vh' }}
//       >
//         <h2 className="text-2xl font-bold mb-4">Product Details</h2>
//         <div className="mb-4">
//           <img src={product.image_url.split(',')[0]} alt={product.product_description} className="h-48 w-full object-cover rounded-md mb-2" />
//           <p><strong>Product Name:</strong> {product.product_name}</p>
//           <p><strong>Description:</strong> {showFullDescription ? product.product_description : shortDescription}</p>
//           {isLongDescription && (
//             <button onClick={handleReadMoreToggle} className="text-blue-500 underline">
//               {showFullDescription ? 'Read Less' : 'Read More'}
//             </button>
//           )}
//           <p><strong>Price:</strong> ${product.price}</p>
//           <p><strong>Product Type:</strong> {product.product_type}</p>
//           <p><strong>Variants:</strong></p>
//           <div className="flex flex-wrap">
//             {product.variants.map((variant, index) => {
//               try {
//                 // Extract color and denier from the variant_attributes field
//                 const attributes = {};
//                 variant.attributes.split(', ').forEach(attr => {
//                   const [key, value] = attr.split(': ');
//                   attributes[key.trim()] = value.trim();
//                 });

//                 return (
//                   <div key={index} className="flex items-center mr-4 mb-2">
//                     <div className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: attributes.Color }}></div>
//                     <div className="flex flex-col">
//                       <p className="text-sm">Denier: {attributes.Denier}</p>
//                       <p className="text-sm">Quantity: {variant.quantity}</p>
//                     </div>
//                   </div>
//                 );
//               } catch (error) {
//                 console.error(`Failed to parse attributes for variant ${index} of product ${product.product_id}:`, error);
//                 return null;
//               }
//             })}
//           </div>
//         </div>
//         {product.error && <p className="text-red-500 mb-4">{product.error}</p>}
//         <div className="flex space-x-4">
//           <button onClick={() => onUpdate(product)} className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-md hover:from-gray-800 hover:to-gray-600">Update</button>
//           <button onClick={() => onRemove(product)} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700">Remove</button>
//           <button onClick={handleClose} className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

"use client";
import React, { useEffect, useState } from 'react';

const ProductDetails = ({ product, onClose, onRemove, onUpdate, position }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
    }, [position]);

    const handleClose = () => {
        window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
        onClose();
    };

    const handleReadMoreToggle = () => {
        setShowFullDescription(!showFullDescription);
    };

    const descriptionWords = product.product_description ? product.product_description.split(' ') : [];
    let shortDescription = '';
    let wordCount = 0;

    for (let word of descriptionWords) {
        if (wordCount + word.length + 1 > 88) break; // +1 for the space
        shortDescription += word + ' ';
        wordCount += word.length + 1;
    }
    shortDescription = shortDescription.trim();
    const isLongDescription = product.product_description && product.product_description.length > shortDescription.length;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-75"></div>
            <div
                className="relative bg-white text-black p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-md overflow-y-auto"
                style={{ maxHeight: '90vh' }}
            >
                <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                <div className="mb-4">
                    <img src={product.image_url.split(',')[0]} alt={product.product_description} className="h-48 w-full object-cover rounded-md mb-2" />
                    <p><strong>Product Name:</strong> {product.product_name}</p>
                    <p><strong>Description:</strong> {showFullDescription ? product.product_description : shortDescription}</p>
                    {isLongDescription && (
                        <button onClick={handleReadMoreToggle} className="text-blue-500 underline">
                            {showFullDescription ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Product Type:</strong> {product.product_type}</p>
                    <p><strong>Variants:</strong></p>
                    <div className="flex flex-wrap">
                        {product.variants && product.variants.map((variant, index) => {
                            try {
                                const attributes = {};
                                variant.variant_attributes.split(', ').forEach(attr => {
                                    const [key, value] = attr.split(': ');
                                    attributes[key.trim()] = value.trim();
                                });

                                return (
                                    <div key={index} className="flex items-center mr-4 mb-2">
                                        <div className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: attributes.Color }}></div>
                                        <div className="flex flex-col">
                                            <p className="text-sm">Denier: {attributes.Denier}</p>
                                            <p className="text-sm">Quantity: {variant.quantity}</p>
                                        </div>
                                    </div>
                                );
                            } catch (error) {
                                console.error(`Failed to parse attributes for variant ${index} of product ${product.product_id}:`, error);
                                return null;
                            }
                        })}
                    </div>
                </div>
                {product.error && <p className="text-red-500 mb-4">{product.error}</p>}
                <div className="flex space-x-4">
                    <button onClick={() => onUpdate(product)} className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-md hover:from-gray-800 hover:to-gray-600">Update</button>
                    <button onClick={() => onRemove(product)} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700">Remove</button>
                    <button onClick={handleClose} className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

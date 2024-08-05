

// "use client";
// import React, { useEffect, useState } from 'react';

// const ProductDetails = ({ product, onClose, onRemove, onUpdate, position }) => {
//     const [showFullDescription, setShowFullDescription] = useState(false);

//     useEffect(() => {
//         window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
//     }, [position]);

//     const handleClose = () => {
//         window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
//         onClose();
//     };

//     const handleReadMoreToggle = () => {
//         setShowFullDescription(!showFullDescription);
//     };

//     const descriptionWords = product.product_description ? product.product_description.split(' ') : [];
//     let shortDescription = '';
//     let wordCount = 0;

//     for (let word of descriptionWords) {
//         if (wordCount + word.length + 1 > 88) break; // +1 for the space
//         shortDescription += word + ' ';
//         wordCount += word.length + 1;
//     }
//     shortDescription = shortDescription.trim();
//     const isLongDescription = product.product_description && product.product_description.length > shortDescription.length;

//     // Group yarn variants by color
//     const groupedVariants = product.variants.reduce((acc, variant) => {
//         const attributes = {};
//         variant.variant_attributes.split(', ').forEach(attr => {
//             const [key, value] = attr.split(': ');
//             attributes[key.trim()] = value.trim();
//         });

//         const color = attributes.Color;
//         if (!acc[color]) {
//             acc[color] = [];
//         }
//         acc[color].push({ ...attributes, quantity: variant.quantity });
//         return acc;
//     }, {});

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-8">
//             <div className="fixed inset-0 bg-black bg-opacity-75"></div>
//             <div className="relative bg-white text-black p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-[40%] w-[40%] overflow-y-auto"
//                 style={{ maxHeight: '90vh' }}
//             >
//                 <h2 className="text-3xl font-bold mb-6">Product Details</h2>
//                 <div className="mb-6">
//                     <img 
//                         src={product.image_url.split(',')[0]} 
//                         alt={product.product_description} 
//                         className="h-64 w-full object-contain rounded-md mb-4" 
//                     />
//                     <p className="text-xl font-semibold mb-2">{product.product_name}</p>
//                     <p className="mb-4">{showFullDescription ? product.product_description : shortDescription}</p>
//                     {isLongDescription && (
//                         <button onClick={handleReadMoreToggle} className="text-blue-500 underline">
//                             {showFullDescription ? 'Read Less' : 'Read More'}
//                         </button>
//                     )}
//                     <p className="text-xl font-semibold mt-4">Price: <span className="text-green-600">${product.price}</span></p>
//                     <p className="text-xl font-semibold mt-4">Product Type: {product.product_type}</p>
//                     <p className="text-xl font-semibold mt-4">Variants:</p>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                         {Object.keys(groupedVariants).map((color, index) => (
//                             <div key={index} className="flex items-center p-4 border rounded-lg bg-gradient-to-r from-gray-100 to-gray-300">
//                                 <div className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300" style={{ backgroundColor: color }}></div>
//                                 <div>
//                                     {groupedVariants[color].map((variant, variantIndex) => (
//                                         <div key={variantIndex} className="mb-2">
//                                             <p className="text-sm"><span className="font-semibold">Denier:</span> {variant.Denier}</p>
//                                             <p className="text-sm"><span className="font-semibold">Quantity:</span> {variant.quantity}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 {product.error && <p className="text-red-500 mb-4">{product.error}</p>}
//                 <div className="flex justify-end space-x-4">
//                     <button onClick={() => onUpdate(product)} className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-md hover:from-gray-800 hover:to-gray-600">Update</button>
//                     <button onClick={() => onRemove(product)} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700">Remove</button>
//                     <button onClick={handleClose} className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">Close</button>
//                 </div>
//             </div>
//         </div>
//     );
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

    // Group yarn variants by color
    const groupedVariants = product.variants.reduce((acc, variant) => {
        const attributes = {};
        variant.variant_attributes.split(', ').forEach(attr => {
            const [key, value] = attr.split(': ');
            attributes[key.trim()] = value.trim();
        });

        const color = attributes.Color;
        if (!acc[color]) {
            acc[color] = [];
        }
        acc[color].push({ ...attributes, quantity: variant.quantity });
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-8">
            <div className="fixed inset-0 bg-black bg-opacity-75"></div>
            <div className="relative bg-white text-black p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-[40%] w-[40%] overflow-y-auto"
                style={{ maxHeight: '100vh' }} // Increased height by 10%
            >
                <h2 className="text-3xl font-bold mb-6">Product Details</h2>
                <div className="mb-6">
                    <img 
                        src={product.image_url.split(',')[0]} 
                        alt={product.product_description} 
                        className="h-64 w-full object-contain rounded-md mb-4" 
                    />
                    <p className="text-xl font-semibold mb-2">{product.product_name}</p>
                    <p className="mb-4">{showFullDescription ? product.product_description : shortDescription}</p>
                    {isLongDescription && (
                        <button onClick={handleReadMoreToggle} className="text-blue-500 underline">
                            {showFullDescription ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                    <p className="text-xl font-semibold mt-4">Price: <span className="text-green-600">${product.price}</span></p>
                    <p className="text-xl font-semibold mt-4">Product Type: {product.product_type}</p>
                    <p className="text-xl font-semibold mt-4">Variants:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {Object.keys(groupedVariants).map((color, index) => (
                            <div key={index} className="flex items-center p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300" style={{ backgroundColor: color }}></div>
                                <div>
                                    {groupedVariants[color].map((variant, variantIndex) => (
                                        <div key={variantIndex} className="mb-2">
                                            <p className="text-sm"><span className="font-semibold">Denier:</span> {variant.Denier}</p>
                                            <p className="text-sm"><span className="font-semibold">Quantity:</span> {variant.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {product.error && <p className="text-red-500 mb-4">{product.error}</p>}
                <div className="flex justify-end space-x-4">
                    <button onClick={() => onUpdate(product)} className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-md hover:from-gray-800 hover:to-gray-600">Update</button>
                    <button onClick={() => onRemove(product)} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-500 hover:to-red-700">Remove</button>
                    <button onClick={handleClose} className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

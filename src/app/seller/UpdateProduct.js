// "use client";
// import React, { useEffect, useState } from 'react';
// import { storage } from '../auth/firebase';
// import { useUserAuth } from '../auth/auth-context';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid';
// import { MdDeleteForever } from "react-icons/md";

// export default function UpdateProduct({ product, onUpdateSuccess, onClose, position }) {
//     const { user } = useUserAuth();
//     const [image, setImage] = useState([]);
//     const [productData, setProductData] = useState({
//         ...product,
//         userId: user ? user.uid : '',
//         yarn_variants: product.yarn_variants || [{ color: '', deniers: [{ denier: '', quantity: 0 }] }],
//         fabric_variants: product.fabric_variants || [{ color: '', quantity: 0 }],
//     });
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (user) {
//             setProductData(prevData => ({ ...prevData, userId: user.uid }));
//         }
//     }, [user]);

//     useEffect(() => {
//         window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
//     }, [position]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (product.product_type !== productData.product_type) {
//             setError('Changing product type from yarn to fabric or vice versa is not allowed. Please remove the product and add a new one.');
//             return;
//         }

//         const urls = await handleUpload();
//         const urlsString = urls.length ? urls.join(",") : productData.image_url;
//         const updatedProductData = { ...productData, image_url: urlsString };

//         try {
//             const response = await fetch(`/api/seller/${product.product_id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(updatedProductData),
//             });
//             if (!response.ok) {
//                 alert('An error occurred while updating the product');
//             } else {
//                 alert('Product updated successfully');
//                 onUpdateSuccess();
//             }
//         } catch (error) {
//             console.error('Unexpected server response:', error);
//         }
//     };

//     const handleClose = () => {
//         window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
//         onClose();
//     };

//     const handleChange = (e) => {
//         setProductData({ ...productData, [e.target.name]: e.target.value });
//     };

//     const handleImageChange = (e) => {
//         setImage([...e.target.files]);
//     };

//     const handleUpload = async () => {
//         const folderId = uuidv4();
//         const urls = [];
//         for (const img of image) {
//             try {
//                 const storageRef = ref(storage, `images/${folderId}/${img.name}`);
//                 const snapshot = await uploadBytes(storageRef, img);
//                 const downloadURL = await getDownloadURL(snapshot.ref);
//                 urls.push(downloadURL);
//             } catch (error) {
//                 console.error('Error uploading image:', error);
//             }
//         }
//         return urls;
//     };

//     const handleYarnVariantChange = (index, field, value) => {
//         const newVariants = [...productData.yarn_variants];
//         newVariants[index][field] = value;
//         setProductData({ ...productData, yarn_variants: newVariants });
//     };

//     const handleDeniersChange = (variantIndex, denierIndex, field, value) => {
//         const newVariants = [...productData.yarn_variants];
//         newVariants[variantIndex].deniers[denierIndex][field] = value;
//         setProductData({ ...productData, yarn_variants: newVariants });
//     };

//     const handleFabricVariantChange = (index, field, value) => {
//         const newVariants = [...productData.fabric_variants];
//         newVariants[index][field] = value;
//         setProductData({ ...productData, fabric_variants: newVariants });
//     };

//     const addYarnVariant = () => {
//         setProductData({ ...productData, yarn_variants: [...productData.yarn_variants, { color: '', deniers: [{ denier: '', quantity: 0 }] }] });
//     };

//     const addDenier = (variantIndex) => {
//         const newVariants = [...productData.yarn_variants];
//         newVariants[variantIndex].deniers.push({ denier: '', quantity: 0 });
//         setProductData({ ...productData, yarn_variants: newVariants });
//     };

//     const removeYarnVariant = (index) => {
//         const newVariants = [...productData.yarn_variants];
//         newVariants.splice(index, 1);
//         setProductData({ ...productData, yarn_variants: newVariants });
//     };

//     const removeDenier = (variantIndex, denierIndex) => {
//         const newVariants = [...productData.yarn_variants];
//         newVariants[variantIndex].deniers.splice(denierIndex, 1);
//         setProductData({ ...productData, yarn_variants: newVariants });
//     };

//     const addFabricVariant = () => {
//         setProductData({ ...productData, fabric_variants: [...productData.fabric_variants, { color: '', quantity: 0 }] });
//     };

//     const removeFabricVariant = (index) => {
//         const newVariants = [...productData.fabric_variants];
//         newVariants.splice(index, 1);
//         setProductData({ ...productData, fabric_variants: newVariants });
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//             <div className="fixed inset-0 bg-black bg-opacity-50"></div>
//             <div
//                 className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-xl transition-transform duration-300 ease-in-out"
//             >
//                 <h2 className="text-2xl font-bold mb-4 text-center">Update Item</h2>
//                 {error && <p className="text-red-500 mb-4">{error}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6 text-black">
//                     <div className="space-y-2">
//                         <label className="block font-semibold">Item Name</label>
//                         <input
//                             type="text"
//                             required
//                             name="product_name"
//                             value={productData.product_name}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <label className="block font-semibold">Description</label>
//                         <textarea
//                             required
//                             name="product_description"
//                             value={productData.product_description}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
//                         ></textarea>
//                     </div>
//                     <div className="space-y-2">
//                         <label className="block font-semibold">Price</label>
//                         <input
//                             type="text"
//                             required
//                             name="price"
//                             value={productData.price}
//                             onChange={handleChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <label className="block font-semibold">Upload Images</label>
//                         <input
//                             type="file"
//                             multiple
//                             name="image_url"
//                             onChange={handleImageChange}
//                             className="w-full"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <label className="block font-semibold">Product Type</label>
//                         <select
//                             name="product_type"
//                             value={productData.product_type}
//                             onChange={handleChange}
//                             required
//                             className="w-full p-3 border border-gray-300 rounded-lg"
//                         >
//                             <option value="yarn">Yarn</option>
//                             <option value="fabric">Fabric</option>
//                         </select>
//                     </div>
//                     {productData.product_type === 'yarn' && (
//                         <div className="space-y-2">
//                             <div>
//                                 <label className="block font-semibold">Yarn Material</label>
//                                 <select 
//                                     type="text" 
//                                     required 
//                                     name="yarn_material" 
//                                     value={productData.yarn_material}  
//                                     onChange={handleChange} 
//                                     className="w-full p-3 border border-gray-300 rounded-lg"
//                                 >
//                                     <option value="" disabled>Select Yarn Material</option>
//                                     <option value="Cotton">Cotton</option>
//                                     <option value="Polyester">Polyester</option>
//                                     <option value="Silk">Silk</option>
//                                     <option value="Wool">Wool</option>
//                                     <option value="Nylon">Nylon</option>    
//                                     <option value="Linen">Linen</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block font-semibold">Yarn Variants</label>
//                                 {productData.yarn_variants.map((variant, index) => (
//                                     <div key={index} className="relative w-80 mr-2">
//                                         <label className="block font-semibold">Color</label>
//                                         <input
//                                             type="color"
//                                             placeholder="Color"
//                                             value={variant.color}
//                                             onChange={(e) => handleYarnVariantChange(index, 'color', e.target.value)}
//                                             className="w-1/3 h-12 my-2 p-1 border border-black rounded-lg" 
//                                         />
//                                         {variant.deniers.map((denier, denierIndex) => (
//                                             <div key={denierIndex} className="flex items-center mb-4">
//                                                 <div className="flex-1 mr-2">
//                                                     <label className="block font-semibold">Denier</label>
//                                                     <input
//                                                         type="text"
//                                                         placeholder="Denier"
//                                                         value={denier.denier}
//                                                         onChange={(e) => handleDeniersChange(index, denierIndex, 'denier', e.target.value)}
//                                                         className="w-full p-3 border border-gray-300 rounded-lg"
//                                                     />
//                                                 </div>
//                                                 <div className="flex-1 mr-2">
//                                                     <label className="block font-semibold">Quantity</label>
//                                                     <input
//                                                         type="number"
//                                                         placeholder="Quantity"
//                                                         value={denier.quantity}
//                                                         onChange={(e) => handleDeniersChange(index, denierIndex, 'quantity', e.target.value)}
//                                                         className="w-full p-3 border border-gray-300 rounded-lg"
//                                                     />
//                                                 </div>
//                                                 {variant.deniers.length > 1 && (
//                                                     <button type="button" onClick={() => removeDenier(index, denierIndex)} className="text-red-500">
//                                                         <MdDeleteForever size={24} />
//                                                     </button>
//                                                 )}
//                                             </div>
//                                         ))}
//                                             <button
//                                                     type="button"
//                                                     onClick={() => addDenier(index)}
//                                                     className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-white hover:text-blue-500">
//                                                     Add Denier
//                                                 </button>
//                                             {productData.yarn_variants.length > 1 && (
//                                             <button type="button" onClick={() => removeYarnVariant(index)} className="text-red-500">
//                                                 <MdDeleteForever size={24} />
//                                             </button>
//                                         )}
//                                     </div>
//                                 ))}
//                                 <button type="button" onClick={addYarnVariant} className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-white hover:text-blue-500">Add Yarn Variant</button>
//                             </div>
//                         </div>
//                     )}
//                     {productData.product_type === 'fabric' && (
//                         <div className="space-y-2">
//                             <div>
//                                 <label className="block font-semibold">Fabric Print Tech</label>
//                                 <input
//                                     type="text"
//                                     required
//                                     name="fabric_print_tech"
//                                     value={productData.fabric_print_tech}
//                                     onChange={handleChange}
//                                     className="w-full p-3 border border-gray-300 rounded-lg"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold">Fabric Material</label>
//                                 <input
//                                     type="text"
//                                     required
//                                     name="fabric_material"
//                                     value={productData.fabric_material}
//                                     onChange={handleChange}
//                                     className="w-full p-3 border border-gray-300 rounded-lg"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-semibold">Fabric Variants</label>
//                                 {productData.fabric_variants.map((variant, index) => (
//                                     <div key={index} className="relative w-80 mr-2">
//                                         <label className="block font-semibold">Color</label>
//                                         <input
//                                             type="color"
//                                             placeholder="Color"
//                                             value={variant.color}
//                                             onChange={(e) => handleFabricVariantChange(index, 'color', e.target.value)}
//                                             className="w-1/3 h-12 my-2 p-1 border border-black rounded-lg"
//                                         />
//                                         <div className="flex items-center mb-4">
//                                             <div className="flex-1 mr-2">
//                                                 <label className="block font-semibold">Quantity</label>
//                                                 <input
//                                                     type="number"
//                                                     placeholder="Quantity"
//                                                     value={variant.quantity}
//                                                     onChange={(e) => handleFabricVariantChange(index, 'quantity', e.target.value)}
//                                                     className="w-full p-3 border border-gray-300 rounded-lg"
//                                                 />
//                                             </div>
//                                             {productData.fabric_variants.length > 1 && (
//                                                 <button type="button" onClick={() => removeFabricVariant(index)} className="text-red-500">
//                                                     <MdDeleteForever size={24} />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <button type="button" onClick={addFabricVariant} className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-white hover:text-blue-500">Add Fabric Variant</button>
//                             </div>
//                         </div>
//                     )}
//                     <div className="flex justify-end space-x-4">
//                         <button onClick={handleClose} type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
//                         <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Update</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// UpdateProduct.js

"use client";
import React, { useEffect, useState } from 'react';
import { storage } from '../auth/firebase';
import { useUserAuth } from '../auth/auth-context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";

export default function UpdateProduct({ product, onUpdateSuccess, onClose, position }) {
    const { user } = useUserAuth();
    const [image, setImage] = useState([]);
    const [productData, setProductData] = useState({
        ...product,
        userId: user ? user.uid : '',
        yarn_variants: product.yarn_variants || [{ variant_id: '', color: '', deniers: [{ denier: '', quantity: 0 }] }],
        fabric_variants: product.fabric_variants || [{ variant_id: '', color: '', quantity: 0 }],
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setProductData(prevData => ({ ...prevData, userId: user.uid }));
        }
    }, [user]);

    useEffect(() => {
        window.scrollTo({ top: position.top - window.innerHeight / 2 + 150, behavior: 'smooth' });
    }, [position]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (product.product_type !== productData.product_type) {
            setError('Changing product type from yarn to fabric or vice versa is not allowed. Please remove the product and add a new one.');
            return;
        }

        const urls = await handleUpload();
        const urlsString = urls.length ? urls.join(",") : productData.image_url;
        const updatedProductData = { ...productData, image_url: urlsString };

        try {
            const response = await fetch(`/api/seller/${product.product_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProductData),
            });
            if (!response.ok) {
                throw new Error('An error occurred while updating the product');
            }
            alert('Product updated successfully');
            onUpdateSuccess();
        } catch (error) {
            console.error('Unexpected server response:', error);
            alert('An error occurred while updating the product');
        }
    };

    const handleClose = () => {
        window.scrollTo({ top: position.prevTop, behavior: 'smooth' });
        onClose();
    };

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage([...e.target.files]);
    };

    const handleUpload = async () => {
        const folderId = uuidv4();
        const urls = [];
        for (const img of image) {
            try {
                const storageRef = ref(storage, `images/${folderId}/${img.name}`);
                const snapshot = await uploadBytes(storageRef, img);
                const downloadURL = await getDownloadURL(snapshot.ref);
                urls.push(downloadURL);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        return urls;
    };

    const handleYarnVariantChange = (index, field, value) => {
        const newVariants = [...productData.yarn_variants];
        newVariants[index][field] = value;
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const handleDeniersChange = (variantIndex, denierIndex, field, value) => {
        const newVariants = [...productData.yarn_variants];
        newVariants[variantIndex].deniers[denierIndex][field] = value;
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const handleFabricVariantChange = (index, field, value) => {
        const newVariants = [...productData.fabric_variants];
        newVariants[index][field] = value;
        setProductData({ ...productData, fabric_variants: newVariants });
    };

    const addYarnVariant = () => {
        setProductData({ ...productData, yarn_variants: [...productData.yarn_variants, { variant_id: '', color: '', deniers: [{ denier: '', quantity: 0 }] }] });
    };

    const addDenier = (variantIndex) => {
        const newVariants = [...productData.yarn_variants];
        newVariants[variantIndex].deniers.push({ denier: '', quantity: 0 });
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const removeYarnVariant = (index) => {
        const newVariants = [...productData.yarn_variants];
        newVariants.splice(index, 1);
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const removeDenier = (variantIndex, denierIndex) => {
        const newVariants = [...productData.yarn_variants];
        newVariants[variantIndex].deniers.splice(denierIndex, 1);
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const addFabricVariant = () => {
        setProductData({ ...productData, fabric_variants: [...productData.fabric_variants, { variant_id: '', color: '', quantity: 0 }] });
    };

    const removeFabricVariant = (index) => {
        const newVariants = [...productData.fabric_variants];
        newVariants.splice(index, 1);
        setProductData({ ...productData, fabric_variants: newVariants });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
                className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl transition-transform duration-300 ease-in-out overflow-y-auto"
                style={{ maxHeight: '90vh' }}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Update Item</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6 text-black">
                    <div className="space-y-2">
                        <label className="block font-semibold">Item Name</label>
                        <input
                            type="text"
                            required
                            name="product_name"
                            value={productData.product_name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-semibold">Description</label>
                        <textarea
                            required
                            name="product_description"
                            value={productData.product_description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
                        ></textarea>
                    </div>
                    <div className="space-y-2">
                        <label className="block font-semibold">Price</label>
                        <input
                            type="text"
                            required
                            name="price"
                            value={productData.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-semibold">Upload Images</label>
                        <input
                            type="file"
                            multiple
                            name="image_url"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-semibold">Product Type</label>
                        <input
                            type="text"
                            name="product_type"
                            value={productData.product_type}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                    </div>
                    {productData.product_type === 'yarn' && (
                        <div className="space-y-2">
                            <div>
                                <label className="block font-semibold">Yarn Material</label>
                                <input 
                                    type="text" 
                                    name="yarn_material" 
                                    value={productData.yarn_material}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Yarn Variants</label>
                                {productData.yarn_variants.map((variant, index) => (
                                    <div key={index} className="relative p-4 bg-gray-100 rounded-lg mb-4">
                                        <label className="block font-semibold">Color</label>
                                        <input
                                            type="color"
                                            value={variant.color}
                                            onChange={(e) => handleYarnVariantChange(index, 'color', e.target.value)}
                                            className="w-12 h-12 p-1 border border-black rounded-lg" 
                                        />
                                        {variant.deniers.map((denier, denierIndex) => (
                                            <div key={denierIndex} className="flex items-center mt-4">
                                                <div className="flex-1 mr-2">
                                                    <label className="block font-semibold">Denier</label>
                                                    <input
                                                        type="text"
                                                        value={denier.denier}
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'denier', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1 mr-2">
                                                    <label className="block font-semibold">Quantity</label>
                                                    <input
                                                        type="number"
                                                        value={denier.quantity}
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'quantity', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                                {variant.deniers.length > 1 && (
                                                    <button type="button" onClick={() => removeDenier(index, denierIndex)} className="text-red-500">
                                                        <MdDeleteForever size={24} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addDenier(index)}
                                            className="px-4 py-2 mt-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg hover:from-gray-800 hover:to-gray-600"
                                        >
                                            Add Denier
                                        </button>
                                        {productData.yarn_variants.length > 1 && (
                                            <button type="button" onClick={() => removeYarnVariant(index)} className="text-red-500 absolute top-4 right-4">
                                                <MdDeleteForever size={24} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addYarnVariant} className="px-4 py-2 mt-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg hover:from-gray-800 hover:to-gray-600">Add Yarn Variant</button>
                            </div>
                        </div>
                    )}
                    {productData.product_type === 'fabric' && (
                        <div className="space-y-2">
                            <div>
                                <label className="block font-semibold">Fabric Print Tech</label>
                                <input
                                    type="text"
                                    name="fabric_print_tech"
                                    value={productData.fabric_print_tech}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Fabric Material</label>
                                <input
                                    type="text"
                                    name="fabric_material"
                                    value={productData.fabric_material}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Fabric Variants</label>
                                {productData.fabric_variants.map((variant, index) => (
                                    <div key={index} className="relative p-4 bg-gray-100 rounded-lg mb-4">
                                        <label className="block font-semibold">Color</label>
                                        <input
                                            type="color"
                                            value={variant.color}
                                            onChange={(e) => handleFabricVariantChange(index, 'color', e.target.value)}
                                            className="w-12 h-12 p-1 border border-black rounded-lg"
                                        />
                                        <div className="flex items-center mt-4">
                                            <div className="flex-1 mr-2">
                                                <label className="block font-semibold">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={variant.quantity}
                                                    onChange={(e) => handleFabricVariantChange(index, 'quantity', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            {productData.fabric_variants.length > 1 && (
                                                <button type="button" onClick={() => removeFabricVariant(index)} className="text-red-500 absolute top-4 right-4">
                                                    <MdDeleteForever size={24} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addFabricVariant} className="px-4 py-2 mt-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg hover:from-gray-800 hover:to-gray-600">Add Fabric Variant</button>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button onClick={handleClose} type="button" className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-md hover:from-green-500 hover:to-green-700">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

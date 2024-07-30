import React, { useEffect, useState } from 'react';
import { storage } from '../auth/firebase';
import { useUserAuth } from "../auth/auth-context";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';
import YarnVariants from './YarnVariants';
import FabricVariants from './FabricVariants';
import { Fab } from '@mui/material';
export default function ListProduct() {
    const { user } = useUserAuth();
    const [image, setImage] = useState([]);
    const [sellerId, setSellerId] = useState('');
    const [productData, setProductData] = useState({
        product_name: '',
        description: '',
        price: '',
        image_url: '',
        userId: '',
        product_type: '',
        yarn_material: '',
        yarn_variants: [{ color: '', deniers: [{ denier: '', quantity: 0 }] }],
        fabric_print_tech: '',
        fabric_material: '',
        fabric_variants: [{ color: '', quantity: 0 }]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setSellerId(user.uid);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
    
        setIsSubmitting(true);
    
        // Show loading state
        Swal.fire({
            title: 'Saving product...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }

        });
    
        try {
            const urls = await handleUpload();
            const urlsString = urls.join(",");
            const updatedProductData = { ...productData, image_url: urlsString, userId: sellerId };
    
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProductData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred while saving the product');
            }
    
            // Success message
            Swal.fire({
                title: 'Product listed successfully',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
    
            // Reset form
            setProductData({
                product_name: '',
                description: '',
                price: '',
                image_url: '',
                userId: '',
                product_type: '',
                yarn_material: '',
                yarn_variants: [{ color: '', deniers: [{ denier: '', quantity: 0 }] }],
                fabric_print_tech: '',
                fabric_material: '',
                fabric_variants: [{ color: '', quantity: 0 }]
            });
            setImage(['']);
    
        } catch (error) {
            console.error('Error saving product:', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
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
        setProductData({ ...productData, yarn_variants: [...productData.yarn_variants, { color: '', deniers: [{ denier: '', quantity: 0 }] }] });
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
        setProductData({ ...productData, fabric_variants: [...productData.fabric_variants, { color: '', quantity: 0 }] });
    };

    const removeFabricVariant = (index) => {
        const newVariants = [...productData.fabric_variants];
        newVariants.splice(index, 1);
        setProductData({ ...productData, fabric_variants: newVariants });
    };

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
         const files = Array.from(e.target.files);
    setImage(files);
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

return (
    user ? (
        <div className="w-full min-h-screen bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 p-8 text-gray-800">
                <h2 className="text-3xl font-bold mb-6 text-center text-black-600">List Product</h2>
                <form onSubmit={handleSubmit} className="space-y-8 text-gray-700">
                    <div className="relative bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-4'>
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">Product Name</label>
                            <input 
                                type="text" 
                                required 
                                name="product_name" 
                                value={productData.product_name} 
                                onChange={handleChange} 
                                className="w-full p-4 border  border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            
                        </div>
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">Product Type</label>
                            <select 
                                name="product_type" 
                                value={productData.product_type} 
                                onChange={handleChange} 
                                required 
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Type</option>
                                <option value="yarn">Yarn</option>
                                <option value="fabric">Fabric</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold">Description</label>
                        <textarea 
                            required 
                            name="description" 
                            value={productData.description} 
                            onChange={handleChange} 
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                        ></textarea>
                    </div>
                    <div className='grid grid-cols-1 mt-4 md:grid-cols-2 gap-8'>
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">Price</label>
                            <input 
                                type="text" 
                                required 
                                name="price" 
                                value={productData.price} 
                                onChange={handleChange} 
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">Upload Images</label>
                            <input 
                                type="file" 
                                required 
                                multiple
                                name="image_url" 
                                onChange={handleImageChange} 
                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
                            />
                        </div>
                    </div>
                    </div>
                    {productData.product_type === 'yarn' && (
                    <YarnVariants
                        handleChange={handleChange}
                        productData ={productData}
                        handleYarnVariantChange ={handleYarnVariantChange} 
                        handleDeniersChange ={handleDeniersChange}
                        addDenier ={addDenier}
                        addYarnVariant ={addYarnVariant}
                        removeYarnVariant ={removeYarnVariant}
                        removeDenier ={removeDenier} 
                    />
                    )}
                    {productData.product_type === 'fabric' && (
                    <FabricVariants
                        productData={productData} 
                        handleChange={handleChange}
                        handleFabricVariantChange={handleFabricVariantChange}
                        addFabricVariant={addFabricVariant}
                        removeFabricVariant={removeFabricVariant}
                    />
                                       )}
                    <div className="text-center">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`px-6 py-3 text-white rounded-lg transition-colors duration-300 ${
                                isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'   
                            }`}
                        >
                            {isSubmitting ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>
            
        </div>
    ) : (
        <p className="text-center text-gray-800">Please log in to list a product.</p>
        )
    );
}

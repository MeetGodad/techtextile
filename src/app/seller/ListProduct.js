"use client";
import React, { useEffect } from 'react';
import { useState } from "react";
import { storage } from '../auth/firebase';
import { useUserAuth } from "../auth/auth-context";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";


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
        yarn_denier: [''],
        yarn_color: [''],
        fabric_print_tech: '',
        fabric_material: '',
        fabric_color: ['']
    });

    useEffect(() => {
        if (user) {
            setSellerId(user.uid);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const urls = await handleUpload();
        const urlsString = urls.join(",");
        const updatedProductData = { ...productData, image_url: urlsString, userId: sellerId };
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProductData),
            });
            if (!response.ok) {
                alert('An error occurred while saving the product');
            } else {
                alert('Product saved successfully');
            }
        } catch (error) {
            console.error('Unexpected server response:', error);
        }
    };

    const addColor = () => {
        if (productData.product_type === 'yarn') {
            setProductData({ ...productData, yarn_color: [...productData.yarn_color, ''] });
        } else if (productData.product_type === 'fabric') {
            setProductData({ ...productData, fabric_color: [...productData.fabric_color, ''] });
        }
    };

    const removeColor = (index) => {
        if (productData.product_type === 'yarn') {
            const updatedColors = [...productData.yarn_color];
            updatedColors.splice(index, 1);
            setProductData({ ...productData, yarn_color: updatedColors });
        } else if (productData.product_type === 'fabric') {
            const updatedColors = [...productData.fabric_color];
            updatedColors.splice(index, 1);
            setProductData({ ...productData, fabric_color: updatedColors });
        }
    };

    const handleColorChange = (index) => (e) => {
        if (productData.product_type === 'yarn') {
            const updatedColors = [...productData.yarn_color];
            updatedColors[index] = e.target.value;
            setProductData({ ...productData, yarn_color: updatedColors });
        } else if (productData.product_type === 'fabric') {
            const updatedColors = [...productData.fabric_color];
            updatedColors[index] = e.target.value;
            setProductData({ ...productData, fabric_color: updatedColors });
        }
    };

    const handleDenierChange = (index) => (e) => {
        const updatedDeniers = [...productData.yarn_denier];
        updatedDeniers[index] = e.target.value;
        setProductData({ ...productData, yarn_denier: updatedDeniers });
    };

    const addDanier = () => {
        setProductData({ ...productData, yarn_denier: [...productData.yarn_denier, ''] });
    };

    const removeDenier = (index) => {
        const updatedDeniers = [...productData.yarn_denier];
        updatedDeniers.splice(index, 1);
        setProductData({ ...productData, yarn_denier: updatedDeniers });
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

return (
    user ? (

        <div className="w-full min-h-screen bg-white p-8 text-black">
            <h2 className="text-2xl font-bold mb-6 text-center">List Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-black">
                <div className="space-y-2">
                    <label className="block font-semibold">Product Name</label>
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
                        name="description" 
                        value={productData.description} 
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
                        required 
                        multiple
                        name="image_url" 
                        onChange={handleImageChange} 
                        className="w-full "
                    />
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Product Type</label>
                    <select 
                        name="product_type" 
                        value={productData.product_type} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                        <option value="">Select Type</option>
                        <option value="yarn">Yarn</option>
                        <option value="fabric">Fabric</option>
                    </select>
                </div>
                {productData.product_type === 'yarn' && (
                    <div className="space-y-2">
                        <div>
                            <label className="block font-semibold">Yarn Type</label>
                            <input 
                                type="text" 
                                required 
                                name="yarn_material" 
                                value={productData.yarn_material}  
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Yarn Deniers</label>
                            {productData.yarn_denier.map((color, index) => (
                                <div key={index} className='relative w-2/12'>
                                    <input 
                                        type="text" 
                                        required 
                                        name="yarn_color" 
                                        value={color}  
                                        onChange={handleDenierChange(index)} 
                                        className="w-full p-3 my-2 border border-gray-300 rounded-lg pr-10" // changed width to full
                                    />
                                    <button 
                                        type="button" 
                                        className='absolute top-1/2 right-2 transform -translate-y-1/2' 
                                        onClick={() => removeDenier(index)}
                                    >
                                        <MdDeleteForever size={35} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" className=" block p-2 border-2 border-black text-white bg-black rounded-lg hover:text-black hover:bg-white" onClick={addDanier}>Add Denier</button>
                        </div>
                        <div>
                            <label className="block font-semibold">Yarn Colors</label>
                            {productData.yarn_color.map((color, index) => (
                                <div key={index} className='relative w-2/12'>
                                    <input 
                                        type="color" 
                                        required 
                                        name="yarn_color" 
                                        value={color}  
                                        onChange={handleColorChange(index)} 
                                        className="w-full p-3 my-2 border border-gray-300 rounded-lg pr-10"
                                    />
                                    <button 
                                        type="button" 
                                        className='absolute top-1/2 right-2 transform -translate-y-1/2' 
                                        onClick={() => removeColor(index)}
                                    >
                                        <MdDeleteForever size={35} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" className=" block p-2 border-2 border-black text-white bg-black rounded-lg hover:text-black hover:bg-white" onClick={addColor}>Add Color</button>
                        </div>
                    </div>
                )}
                {productData.product_type === 'fabric' && (
                    <div className="space-y-2">
                        <div>
                            <label className="block font-semibold">Fabric Print Tech</label>
                            <input 
                                type="text" 
                                required 
                                name="fabric_print_tech" 
                                value={productData.fabric_print_tech} 
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Fabric Material</label>
                            <input 
                                type="text" 
                                required 
                                name="fabric_material" 
                                value={productData.fabric_material} 
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Fabric Colors</label>
                            {productData.fabric_color.map((color, index) => (
                                <div key={index} className='relative w-2/12'>
                                    <input 
                                        type="text" 
                                        required 
                                        name="yarn_color" 
                                        value={color}  
                                        onChange={handleColorChange(index)} 
                                        className="w-full p-3 my-2 border border-gray-300 rounded-lg pr-10" // changed width to full
                                    />
                                    <button 
                                        type="button" 
                                        className='absolute top-1/2 right-2 transform -translate-y-1/2' 
                                        onClick={() => removeColor(index)}
                                    >
                                        <MdDeleteForever size={35} />
                                    </button>
                                    {/* <label className="block font-semibold">Upload Images</label>
                                    <input 
                                        type="file" 
                                        required 
                                        multiple
                                        name="image_url" 
                                        onChange={handleImageChange} 
                                        className="w-full  "
                                    /> */}
                                </div>
                            ))}
                            <button type="button" className=" block p-2 border-2 border-black text-white bg-black rounded-lg hover:text-black hover:bg-white" onClick={addColor}>Add Color</button>
                        </div>
                    </div>
                )}
                <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </div>     
    ) : (
  
        <div className="flex items-center justify-center h-screen">
    <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Please sign up or log in first.</p>
    </div>
    </div>
    )
);
};
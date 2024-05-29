"use client";
import { useState } from "react";
import { storage } from '../auth/firebase';
import { useUserAuth } from "../auth/auth-context";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function ListProduct(){

    const { user } = useUserAuth();
    const [image, setImage] = useState([]);
    const [productData, setProductData] = useState({
    product_name: '',
    description: '',
    price: '',
    image_url: '',
    seller_id: user.uid,
    product_type: '',
    yarn_type: '',
    yarn_denier: '',
    yarn_color: '',
    fabric_type: '',
    fabric_print_tech: '',
    fabric_material: '',
    fabric_color: ''
})
const handleSubmit = async (e) => {
    e.preventDefault();
    const urls = await handleUpload();
    const urlsString = urls.join(",")
    const updatedProductData = { ...productData, image_url: urlsString };
    try{
        const response = await fetch('api/products', {
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
    }
    catch(error){
        console.error('Unexpected server response:', error);
    }



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
        <div className="flex">
        <div className="flex">
        <div className="w-2/3 bg-white p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">List Item</h2>
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
                        className="w-full  "
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
                                name="yarn_type" 
                                value={productData.yarn_type}  
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Yarn Denier</label>
                            <input 
                                type="text" 
                                required 
                                name="yarn_denier" 
                                value={productData.yarn_denier} 
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold">Yarn Color</label>
                            <input 
                                type="text" 
                                required 
                                name="yarn_color" 
                                value={productData.yarn_color}  
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                )}
                {productData.product_type === 'fabric' && (
                    <div className="space-y-2">
                        <div>
                            <label className="block font-semibold">Fabric Type</label>
                            <input 
                                type="text" 
                                required 
                                name="fabric_type" 
                                value={productData.fabric_type}  
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
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
                            <label className="block font-semibold">Fabric Color</label>
                            <input 
                                type="text" 
                                required 
                                name="fabric_color" 
                                value={productData.fabric_color}  
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                )}
                <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </div>
        <div className="w-1/3 flex items-center justify-center bg-black ">
        <img src="Images/LOGO.png" alt="Logo" className="w-3/4 h-auto" />
        </div>
        </div>
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
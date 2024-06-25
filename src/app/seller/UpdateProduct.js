"use client";
import React, { useEffect, useState } from 'react';
import { storage } from '../auth/firebase';
import { useUserAuth } from '../auth/auth-context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function UpdateProduct({ product, onUpdateSuccess, onClose, position }) {
    const { user } = useUserAuth();
    const [image, setImage] = useState([]);
    const [productData, setProductData] = useState({
        ...product,
        userId: user ? user.uid : '',
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
                alert('An error occurred while updating the product');
            } else {
                alert('Product updated successfully');
                onUpdateSuccess();
            }
        } catch (error) {
            console.error('Unexpected server response:', error);
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

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
                className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-transform duration-300 ease-in-out"
            >
                <h2 className="text-2xl font-bold mb-4">Update Item</h2>
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
                            multiple
                            name="image_url"
                            onChange={handleImageChange}
                            className="w-full"
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
                    <div className="flex justify-end space-x-4">
                        <button onClick={handleClose} type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

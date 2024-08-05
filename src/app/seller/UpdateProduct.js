"use client";
import React, { useEffect, useState } from 'react';
import { storage } from '../auth/firebase';
import { useUserAuth } from '../auth/auth-context';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function UpdateProduct({ product, onUpdateSuccess, onClose, position }) {
    const { user } = useUserAuth();
    const [image, setImage] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [productData, setProductData] = useState({
        ...product,
        userId: user ? user.uid : '',
        yarn_variants: product.variants ? product.variants.filter(variant => variant.variant_attributes.includes('Denier')).map(variant => ({
            variant_id: variant.variant_id,
            color: variant.variant_attributes.match(/Color: (.*?)(,|$)/)[1],
            deniers: [{
                denier: variant.variant_attributes.match(/Denier: (.*?)(,|$)/)[1],
                quantity: variant.quantity,
                new: false
            }],
        })) : [],
        fabric_variants: product.variants ? product.variants.filter(variant => !variant.variant_attributes.includes('Denier')).map(variant => ({
            variant_id: variant.variant_id,
            color: variant.variant_attributes.match(/Color: (.*?)(,|$)/)[1],
            quantity: variant.quantity
        })) : [],
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

    useEffect(() => {
        setProductData({
            ...product,
            yarn_variants: product.variants ? product.variants.filter(variant => variant.variant_attributes.includes('Denier')).map(variant => ({
                variant_id: variant.variant_id,
                color: variant.variant_attributes.match(/Color: (.*?)(,|$)/)[1],
                deniers: [{
                    denier: variant.variant_attributes.match(/Denier: (.*?)(,|$)/)[1],
                    quantity: variant.quantity,
                    new: false
                }],
            })) : [],
            fabric_variants: product.variants ? product.variants.filter(variant => !variant.variant_attributes.includes('Denier')).map(variant => ({
                variant_id: variant.variant_id,
                color: variant.variant_attributes.match(/Color: (.*?)(,|$)/)[1],
                quantity: variant.quantity
            })) : [],
        });
    }, [product]);

    // Group yarn variants by color and combine deniers with the same color
    const groupedYarnVariants = productData.yarn_variants.reduce((acc, variant) => {
        const existingVariant = acc.find(v => v.color === variant.color);
        if (existingVariant) {
            const existingDenier = existingVariant.deniers.find(d => d.denier === variant.deniers[0].denier);
            if (!existingDenier) {
                existingVariant.deniers.push(...variant.deniers);
            }
        } else {
            acc.push({ ...variant, deniers: [...variant.deniers] });
        }
        return acc;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (product.product_type !== productData.product_type) {
            setError('Changing product type from yarn to fabric or vice versa is not allowed. Please remove the product and add a new one.');
            return;
        }

        // Check for missing denier or quantity values
        for (const variant of productData.yarn_variants) {
            for (const denier of variant.deniers) {
                if (!denier.denier || !denier.quantity) {
                    MySwal.fire({
                        title: 'Error',
                        text: 'Every denier must have a quantity and every quantity must have a denier.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
            }
        }

        setIsUpdating(true);

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
            MySwal.fire({
                title: 'Success',
                text: 'Product updated successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            onUpdateSuccess();
        } catch (error) {
            console.error('Unexpected server response:', error);
            MySwal.fire({
                title: 'Error',
                text: 'An error occurred while updating the product',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsUpdating(false);
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
        const newVariants = [...groupedYarnVariants];
        newVariants[index][field] = value;
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const handleDeniersChange = (variantIndex, denierIndex, field, value) => {
        const newVariants = [...groupedYarnVariants];
        newVariants[variantIndex].deniers[denierIndex][field] = value;
        newVariants[variantIndex].deniers[denierIndex].new = true;
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    const handleFabricVariantChange = (index, field, value) => {
        const newVariants = [...productData.fabric_variants];
        newVariants[index][field] = value;
        setProductData({ ...productData, fabric_variants: newVariants });
    };

    const addYarnVariant = () => {
        setProductData({
            ...productData,
            yarn_variants: [...productData.yarn_variants, { variant_id: '', color: '', deniers: [{ denier: '', quantity: '', new: true }] }]
        });
    };

    const addDenier = (variantIndex) => {
        const newVariants = [...groupedYarnVariants];
        newVariants[variantIndex].deniers.push({ denier: '', quantity: '', new: true });
        setProductData({ ...productData, yarn_variants: newVariants });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-8">
            <div className="fixed inset-0 bg-black bg-opacity-75"></div>
            <div className="relative bg-white text-black p-8 rounded-lg shadow-lg transition-transform duration-300 ease-in-out max-w-[70%] w-[70%] overflow-y-auto"
                style={{ maxHeight: '90vh' }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Update Item</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    value={productData.yarn_material || ''}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Yarn Variants</label>
                                {groupedYarnVariants.map((variant, index) => (
                                    <div key={index} className="relative p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                                        <label className="block font-semibold">Color</label>
                                        <input
                                            type="color"
                                            value={variant.color || ''}
                                            onChange={(e) => handleYarnVariantChange(index, 'color', e.target.value)}
                                            className="w-12 h-12 p-1 border border-black rounded-lg" 
                                        />
                                        {variant.deniers.map((denier, denierIndex) => (
                                            <div key={denierIndex} className="flex items-center mt-4">
                                                <div className="flex-1 mr-2">
                                                    <label className="block font-semibold">Denier</label>
                                                    <input
                                                        type="text"
                                                        value={denier.denier || ''}
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'denier', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                        readOnly={!denier.new}
                                                    />
                                                </div>
                                                <div className="flex-1 mr-2">
                                                    <label className="block font-semibold">Quantity</label>
                                                    <input
                                                        type="number"
                                                        value={denier.quantity || ''}
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'quantity', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addDenier(index)}
                                            className="px-4 py-2 mt-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg hover:from-gray-800 hover:to-gray-600"
                                        >
                                            Add Denier
                                        </button>
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
                                    value={productData.fabric_print_tech || ''}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Fabric Material</label>
                                <input
                                    type="text"
                                    name="fabric_material"
                                    value={productData.fabric_material || ''}
                                    readOnly
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Fabric Variants</label>
                                {productData.fabric_variants.map((variant, index) => (
                                    <div key={index} className="relative p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                                        <label className="block font-semibold">Color</label>
                                        <input
                                            type="color"
                                            value={variant.color || ''}
                                            onChange={(e) => handleFabricVariantChange(index, 'color', e.target.value)}
                                            className="w-12 h-12 p-1 border border-black rounded-lg"
                                        />
                                        <div className="flex items-center mt-4">
                                            <div className="flex-1 mr-2">
                                                <label className="block font-semibold">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={variant.quantity || ''}
                                                    onChange={(e) => handleFabricVariantChange(index, 'quantity', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addFabricVariant} className="px-4 py-2 mt-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg hover:from-gray-800 hover:to-gray-600">Add Fabric Variant</button>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4">
                        <button onClick={handleClose} type="button" className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-md hover:from-gray-500 hover:to-gray-700">Cancel</button>
                        <button type="submit" className={`px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-md hover:from-green-500 hover:to-green-700 ${isUpdating ? 'cursor-not-allowed' : ''}`} disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

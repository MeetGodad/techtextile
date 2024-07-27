import React, { useEffect, useState } from 'react';
import { storage } from '../auth/firebase';
import { useUserAuth } from "../auth/auth-context";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteForever } from "react-icons/md";
import Swal from 'sweetalert2';
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
            <div className="w-full min-h-screen bg-white p-8 text-black">
                <h2 className="text-2xl font-bold mb-6 text-center">List Product</h2>
                <form onSubmit={handleSubmit} className="space-y-6 text-black">
                    <div className='grid grid-cols-2 gap-8'>
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
                    <div className='grid grid-cols-2 gap-9'>
                    <div className="space-y-2">
                        <label className="block font-semibold">Price</label>
                        <input 
                            type="text" 
                            required 
                            name="price" 
                            value={productData.price} 
                            onChange={handleChange} 
                            className="w-2/3 p-3 border border-gray-300 rounded-lg"
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
                    </div>
                    {productData.product_type === 'yarn' && (
                        <div className="space-y-2">
                            <div>
                                <label className="block font-semibold">Yarn Material</label>
                                <select 
                                    type="text" 
                                    required 
                                    name="yarn_material" 
                                    value={productData.yarn_material}  
                                    onChange={handleChange} 
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="" disabled>Select Yarn Material</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Polyester">Polyester</option>
                                    <option value="Silk">Silk</option>
                                    <option value="Wool">Wool</option>
                                    <option value="Nylon">Nylon</option>    
                                    <option value="Linen">Linen</option>
                                    <option value="Acrylic">Acrylic</option>
                                    <option value="All Yarns">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold">Yarn Variants</label>
                                {productData.yarn_variants.map((variant, index) => (
                                    <div key={index} className="relative w-80 mr-2">
                                        <label className="block font-semibold">Color</label>
                                        <input
                                            type="color"
                                            placeholder="Color"
                                            required
                                            value={variant.color}
                                            onChange={(e) => handleYarnVariantChange(index, 'color', e.target.value)}
                                            className="w-1/3 h-12 my-2 p-1 border border-black rounded-lg" 
                                        />
                                        {variant.deniers.map((denier, denierIndex) => (
                                            <div key={denierIndex} className="flex items-center mb-4">
                                                <div className="flex-1 mr-2">
                                                    <label className="block font-semibold">Denier</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Denier"
                                                        required
                                                        value={denier.denier}
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'denier', e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                                <div className="flex-1 mr-2">
                                                    <label className="block font-semibold">Quantity</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Quantity"
                                                        required
                                                        value={denier.quantity}
                                                        min="1"
                                                        onChange={
                                                            (e) => {handleDeniersChange(index, denierIndex, 'quantity', e.target.value) }}
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
                                                    className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-white hover:text-blue-500">
                                                    Add Denier
                                                </button>
                                            {productData.yarn_variants.length > 1 && (
                                            <button type="button" onClick={() => removeYarnVariant(index)} className="text-red-500">
                                                <MdDeleteForever size={24} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addYarnVariant} className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-white hover:text-blue-500">Add Yarn Variant</button>
                            </div>
                        </div>
                    )}
                    {productData.product_type === 'fabric' && (
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block font-semibold">Fabric Print Technology</label>
                                <select 
                                    type="text" 
                                    required 
                                    name="fabric_print_tech" 
                                    value={productData.fabric_print_tech} 
                                    onChange={handleChange} 
                                    className="w-2/3 mt-4 p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="" disabled>Select Fabric Print Technology</option>
                                    <option value="Handblock & Dyed">Handblock & Dyed</option>
                                    <option value="Screen Print">Screen Print</option>
                                    <option value="Digital Print">Digital Print</option>
                                    <option value="Marble Print">Marble Print</option>
                                    <option value="Plain">Plain</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold">Fabric Material</label>
                                <select 
                                    type="text" 
                                    required 
                                    name="fabric_material" 
                                    value={productData.fabric_material}  
                                    onChange={handleChange} 
                                    className="w-2/4 mt-4 p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="" disabled>Select Fabric Material</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Linen">Linen</option>
                                    <option value="Silk & Blends">Silk & Blends</option>
                                    <option value="Polyester">Polyester</option>
                                    <option value="Sustainable">Sustainable</option>
                                    <option value="Wool">Wool</option>
                                    <option value="Nylon">Nylon</option> 
                                    <option value="Viscose">Viscose</option>
                                    <option value="All Fabrics">Other</option>
                                    
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold mb-2">Fabric Variants</label>
                                {productData.fabric_variants.map((variant, index) => (
            <div key={index} className="mb-4">
                 <div className="flex items-center mb-4">
                    <div className="mr-8">
                        <label className="block mb-2 font-semibold">Color</label>
                        <input
                            type="color"
                            required
                            placeholder="Color"
                            value={variant.color}
                            onChange={(e) => handleFabricVariantChange(index, 'color', e.target.value)}
                            className="w-full h-12 p-1 border border-gray-300 rounded-lg"
            style={{ minWidth: '120px' }}
                        />
                    </div>
            <div className="mr-2">
                <label className="block mb-2 font-semibold">Quantity</label>
                <input
                    type="number"
                    placeholder="Quantity"
                    required
                    min='1'
                    value={variant.quantity}
                    onChange={(e) => handleFabricVariantChange(index, 'quantity', e.target.value)}
                    className="w-1/3 p-3 border border-gray-300 rounded-lg"
                />
            
            {productData.fabric_variants.length > 1 && (
                <button type="button" onClick={() => removeFabricVariant(index)} className=" ml-4 text-red-500">
                    <MdDeleteForever size={24} />
                </button>
                                                )}
                                                </div>
        </div>
        </div>
        ))}
            <button
                type="button"
                onClick={addFabricVariant}
                className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-white hover:text-blue-500"
            >
                Add Fabric Variant
            </button>
                    </div>
                        </div>
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
            <p className="text-center">Please log in to list a product.</p>
        )
    );
}

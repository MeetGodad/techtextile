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
            <h2 className="text-4xl font-extrabold mb-10 text-center text-black">List Your Product</h2>
            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-gray-100 p-8 rounded-xl shadow-lg">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className="space-y-2">
                  <label className="block font-semibold text-lg text-gray-800">Product Name</label>
                  <input 
                    type="text" 
                    required 
                    name="product_name" 
                    value={productData.product_name} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-lg text-gray-800">Product Type</label>
                  <select 
                    name="product_type" 
                    value={productData.product_type} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="yarn">Yarn</option>
                    <option value="fabric">Fabric</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-semibold text-lg text-gray-800">Description</label>
                <textarea 
                  required 
                  name="description" 
                  value={productData.description} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-400 rounded-lg h-32 resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                ></textarea>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className="space-y-2">
                  <label className="block font-semibold text-lg text-gray-800">Price</label>
                  <input 
                    type="text" 
                    required 
                    name="price" 
                    value={productData.price} 
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-semibold text-lg text-gray-800">Upload Images</label>
                  <input 
                    type="file" 
                    required 
                    multiple
                    name="image_url" 
                    onChange={handleImageChange} 
                    className="w-full p-2 border border-gray-400 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-black"
                  />
                </div>
              </div>
              {productData.product_type === 'yarn' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-lg text-gray-800">Yarn Material</label>
                  <select 
                    type="text" 
                    required 
                    name="yarn_material" 
                    value={productData.yarn_material}  
                    onChange={handleChange} 
                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
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
              )}
              <div className="text-center">
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-black text-white font-bold rounded-full shadow-md"
                >
                  List Product
                </button>
              </div>
            </form>
          </div>
        ) : null
      );
    }
"use client";
import { useState } from "react";

export default function listproduct(){
const [productData, setProductData] = useState({
    product_name: '',
    description: '',
    price: '',
    image_url: '',
    seller_id: 9,
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
    try{
        const response = await fetch('api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
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


    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col ml-8 p-4">
                <div className="p-4">
                    <label className="m-4">Product Name</label>
                    <input type="text" required name="product_name" value={productData.product_name} onChange={handleChange}  />
                </div>
                <div>
                    <label>Product Description</label>
                    <input type="text" required name="description" value={productData.description} onChange={handleChange} />
                </div>
                <div>
                    <label>Price</label>
                    <input type="text" required name="price" value={productData.price} onChange={handleChange} />
                </div>
                <div>
                    <label>Image URL</label>
                    <input type="text" required name="image_url" value={productData.image_url} onChange={handleChange} />
                </div>
                <div>
                <label>Product Type:</label>
                <select name="product_type" value={productData.product_type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="yarn">Yarn</option>
                    <option value="fabric">Fabric</option>
                </select>
                </div>

                {
                    productData.product_type === 'yarn' && (
                        <div>
                            <div><label>Yarn Type</label>
                            <input type="text" required name="yarn_type" value={productData.yarn_type}  onChange={handleChange}/>
                            </div>
                            <div><label>Yarn Denier</label>
                            <input type="text" required name="yarn_denier" value={productData.yarn_denier} onChange={handleChange} />
                            </div>
                            <div><label>Yarn Color</label>
                            <input type="text" required name="yarn_color" value={productData.yarn_color}  onChange={handleChange}/>
                            </div>
                            
                        </div>
                    )
                }

                {
                    productData.product_type === 'fabric' && (
                    <div>
                        <div><label>Fabric Type</label>
                        <input type="text" required name="fabric_type" value={productData.fabric_type}  onChange={handleChange}/>
                        </div>
                        <div><label>Fabric Print Tech</label>
                        <input type="text" required name="fabric_print_tech" value={productData.fabric_print_tech} onChange={handleChange} />
                        </div>
                        <div><label>Fabric Material</label>
                        <input type="text" required name="fabric_material" value={productData.fabric_material} onChange={handleChange} />
                        </div>
                        <div><label>Fabric Color</label>
                        <input type="text" required name="fabric_color" value={productData.fabric_color}  onChange={handleChange}/>
                        </div>
                        
                    </div>
                    )}
                <button type="submit">Submit</button>
            </form>
        </div>
    );

}

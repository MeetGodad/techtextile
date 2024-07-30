import React, { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';

const FabricVariants = ({ productData, 
    handleChange, 
    handleFabricVariantChange, 
    addFabricVariant, 
    removeFabricVariant })=> {
    return (
    
            <div>
                            <div className='grid grid-cols-2 gap-8 relative bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 p-4 border border-gray-200 rounded-lg shadow-sm mb-4'>
                                <div>
                                <label className="block text-lg font-semibold">Fabric Print Technology</label>
                                <select 
                                    type="text" 
                                    required 
                                    name="fabric_print_tech" 
                                    value={productData.fabric_print_tech} 
                                    onChange={handleChange} 
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <label className="block text-lg font-semibold">Fabric Material</label>
                                <select 
                                    type="text" 
                                    required 
                                    name="fabric_material" 
                                    value={productData.fabric_material}  
                                    onChange={handleChange} 
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            </div>
                            
                            <div>
                                <label className="block text-lg font-semibold mb-2">Fabric Variants</label>
                                {productData.fabric_variants.map((variant, index) => (
                                    <div key={index} className="relative bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                                        <div className="flex items-center">
                                            <div className="mr-8">
                                                <label className="block text-lg font-semibold mb-2">Color</label>
                                                <input
                                                    type="color"
                                                    required
                                                    placeholder="Color"
                                                    value={variant.color}
                                                    onChange={(e) => handleFabricVariantChange(index, 'color', e.target.value)}
                                                    className="w-40 h-16 p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div className="mr-4">
                                                <label className="block text-lg font-semibold mb-2">Quantity</label>
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    required
                                                    min='1'
                                                    value={variant.quantity}
                                                    onChange={(e) => handleFabricVariantChange(index, 'quantity', e.target.value)}
                                                    className="w-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {productData.fabric_variants.length > 1 && (
                                                <button type="button" onClick={() => removeFabricVariant(index)} className="text-red-500 mt-6">
                                                    <MdDeleteForever size={24} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addFabricVariant}
                                    className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg border border-blue-500 hover:bg-blue-600"
                                >
                                    Add Fabric Variant
                                </button>
                            </div>
                        </div>
    )
 }
export default FabricVariants;
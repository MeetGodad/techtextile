
import React, { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';

const YarnVariants = ({ handleChange, 
    productData, 
    handleYarnVariantChange, 
    handleDeniersChange, 
    addDenier, 
    addYarnVariant, 
    removeYarnVariant, 
    removeDenier }) => { 
    return (
        <><div className="space-y-2">
                            <div className="relative bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                            <div>
                                <label className="block text-lg font-semibold mb-2">Yarn Material</label>
                                <select 
                                    type="text" 
                                    required 
                                    name="yarn_material" 
                                    value={productData.yarn_material}  
                                    onChange={handleChange} 
                                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                            </div>
                            <div className="relative bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100 p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                                <label className="block text-lg font-semibold mb-6">Yarn Variants</label>
                                {productData.yarn_variants.map((variant, index) => (
                                    <div key={index} className="relative bg-gray-200 p-4 border border-gray-200 rounded-lg shadow-sm mb-4">
                                        <label className="block text-lg font-semibold">Color</label>
                                        <input
                                            type="color"
                                            placeholder="Color"
                                            required
                                            value={variant.color}
                                            onChange={(e) => handleYarnVariantChange(index, 'color', e.target.value)}
                                            className="w-40 h-16 p-2 my-2 border border-gray-300 rounded-lg"
                                        />
                                        {variant.deniers.map((denier, denierIndex) => (
                                            <div key={denierIndex} className="flex items-center mb-4">
                                                <div className="flex-1 mr-4">
                                                    <label className="block text-lg font-semibold">Denier</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Denier"
                                                        required
                                                        value={denier.denier}
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'denier', e.target.value)}
                                                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                    />
                                                </div>
                                                <div className="flex-1 mr-4">
                                                    <label className="block text-lg font-semibold">Quantity</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Quantity"
                                                        required
                                                        value={denier.quantity}
                                                        min="1"
                                                        onChange={(e) => handleDeniersChange(index, denierIndex, 'quantity', e.target.value)}
                                                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                                                    />
                                                </div>
                                                {variant.deniers.length > 1 && (
                                                    <button type="button" onClick={() => removeDenier(index, denierIndex)} className="text-black-500 mt-6">
                                                        <MdDeleteForever size={24} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addDenier(index)}
                                            className="px-4 py-2 mt-2 bg-gray-600 text-white rounded-lg border border-gray-500 hover:bg-gray-800"
                                        >
                                            Add Denier
                                        </button>
                                        {productData.yarn_variants.length > 1 && (
                                            <button type="button" onClick={() => removeYarnVariant(index)} className="text-black-500 ml-4">
                                                <MdDeleteForever size={24} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addYarnVariant}
                                    className="px-4 py-2 mt-2 bg-gray-600 text-white rounded-lg border border-gray-500 hover:bg-gray-800"
                                >
                                    Add Yarn Variant
                                </button>
                            </div>
                        </div>
        </>
)
    
}
export default YarnVariants;
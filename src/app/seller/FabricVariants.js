import React, { useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';

const FabricVariants = ({ productData, 
    handleChange, 
    handleFabricVariantChange, 
    addFabricVariant, 
    removeFabricVariant })=> {
        return (
            <div className="space-y-8 bg-white p-6 rounded-xl shadow-lg">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className="space-y-2">
                  <label className="block text-xl font-bold text-gray-800">Fabric Print Technology</label>
                  <select 
                    required 
                    name="fabric_print_tech" 
                    value={productData.fabric_print_tech} 
                    onChange={handleChange} 
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
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
                <div className="space-y-2">
                  <label className="block text-xl font-bold text-gray-800">Fabric Material</label>
                  <select 
                    required 
                    name="fabric_material" 
                    value={productData.fabric_material}  
                    onChange={handleChange} 
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
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
              
              <div className="space-y-4">
                <label className="block text-xl font-bold text-gray-800">Fabric Variants</label>
                {productData.fabric_variants.map((variant, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <div className="flex flex-wrap items-end gap-6">
                      <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">Color</label>
                        <input
                          type="color"
                          required
                          value={variant.color}
                          onChange={(e) => handleFabricVariantChange(index, 'color', e.target.value)}
                          className="w-20 h-20 p-1 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-lg font-semibold text-gray-700">Quantity</label>
                        <input
                          type="number"
                          placeholder="Quantity"
                          required
                          min='1'
                          value={variant.quantity}
                          onChange={(e) => handleFabricVariantChange(index, 'quantity', e.target.value)}
                          className="w-32 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
                        />
                      </div>
                      {productData.fabric_variants.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeFabricVariant(index)} 
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <MdDeleteForever size={28} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFabricVariant}
                  className="px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
                >
                  Add Fabric Variant
                </button>
              </div>
            </div>
          )
 }
export default FabricVariants;
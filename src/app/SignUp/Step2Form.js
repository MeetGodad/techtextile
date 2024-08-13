// components/Step2Form.js
"use client";
import { useState, useEffect } from 'react';
import AddressInput from '../components/AddressInput';

export function Step2Form({ formData, handleChange, role }) {

    const [isAddressLoaded, setIsAddressLoaded] = useState(true);
    const [isFormLoaded, setIsFormLoaded] = useState(false);
  
    useEffect(() => {
      if (isAddressLoaded) {
        setIsFormLoaded(true);
      }
    }, [isAddressLoaded]);

    return (
      <div className="p-4 w-full">
        <h2 className="block text-base leading-tight font-medium text-black mb-2">Personal Information</h2>
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2 pr-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="first-name">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={formData.firstName}
                  disabled={role === ""}
                  className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="last-name">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={formData.lastName}
                  disabled={role === ""}
                  className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2 pr-2">
                <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="phone">
                  {role === "seller" ? "Company Phone" : "Phone"}
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  disabled={role === ""}
                  pattern="[0-9]{10}"
                  onChange={handleChange}
                  className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                />
              </div>
              {role === "seller" && (
                <div className="w-1/2 pl-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="company-name">Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    required
                    disabled={role === ""}
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  />
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700" htmlFor="address">
                {role === "seller" ? "Company Address" : "Address"}
              </label>
              <AddressInput
                setIsAddressLoaded={setIsAddressLoaded}
                supportedCountries={role === "seller" ? ['CA', 'IN'] : ['CA']}
                role={role}
                street={formData.street}
                city={formData.city}
                state={formData.state}
                postalCode={formData.postalCode}
                country={formData.country}
                setStreet={(value) => handleChange({ target: { name: 'street', value } })}
                setCity={(value) => handleChange({ target: { name: 'city', value } })}
                setState={(value) => handleChange({ target: { name: 'state', value } })}
                setPostalCode={(value) => handleChange({ target: { name: 'postalCode', value } })}
                setStateCode={(value) => handleChange({ target: { name: 'state', value } })}
                setCountryCode={(value) => handleChange({ target: { name: 'country', value } })}
                className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
          </div>
    );
  }
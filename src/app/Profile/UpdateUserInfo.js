"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';

const UpdateUserInfo = ({ onClose }) => {
  const { user } = useUserAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    },
    companyName: '',
    role: ''
  });

  useEffect(() => {
    if (user) {
      fetch(`/api/profileupdate/${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setUserData({
              firstName: data.user.first_name,
              lastName: data.user.last_name,
              phone: data.user.user_type === 'buyer' ? data.user.buyer_phone_num : data.user.seller_phone_num,
              address: {
                street: data.user.street,
                city: data.user.city,
                state: data.user.state,
                postalCode: data.user.postal_code
              },
              companyName: data.user.user_type === 'seller' ? data.user.business_name : '',
              role: data.user.user_type
            });
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`/api/profileupdate/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Redirect to the homepage
      window.location.href = '/';
    } catch (error) {
      console.error('An error occurred while updating the user information:', error);
      // Redirect to the homepage in case of error as well
      window.location.href = '/';
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Update User Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">First Name</label>
            <input 
              type="text" 
              required 
              name="firstName" 
              value={userData.firstName} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Last Name</label>
            <input 
              type="text" 
              required 
              name="lastName" 
              value={userData.lastName} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Phone Number</label>
            <input 
              type="text" 
              required 
              name="phone" 
              value={userData.phone} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Street</label>
            <input 
              type="text" 
              required 
              name="street" 
              value={userData.address.street} 
              onChange={handleAddressChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">City</label>
            <input 
              type="text" 
              required 
              name="city" 
              value={userData.address.city} 
              onChange={handleAddressChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">State</label>
            <input 
              type="text" 
              required 
              name="state" 
              value={userData.address.state} 
              onChange={handleAddressChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700">Postal Code</label>
            <input 
              type="text" 
              required 
              name="postalCode" 
              value={userData.address.postalCode} 
              onChange={handleAddressChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          {userData.role === 'seller' && (
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">Company Name</label>
              <input 
                type="text" 
                required 
                name="companyName" 
                value={userData.companyName} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition duration-300"
            >
              Update Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserInfo;

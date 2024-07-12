"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
      fetch(`/api/Profile/${user.uid}`, {
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
              phone: data.user.user_type === 'buyer' ? data.user.buyerDetails.phone_num : data.user.sellerDetails.phone_num,
              address: data.user.user_type === 'buyer' ? {
                street: data.user.buyerDetails.street,
                city: data.user.buyerDetails.city,
                state: data.user.buyerDetails.state,
                postalCode: data.user.buyerDetails.postal_code
              } : {
                street: data.user.sellerDetails.street,
                city: data.user.sellerDetails.city,
                state: data.user.sellerDetails.state,
                postalCode: data.user.sellerDetails.postal_code
              },
              companyName: data.user.user_type === 'seller' ? data.user.sellerDetails.business_name : '',
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
      const response = await fetch(`/api/Profile/${user.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
        });
      } else {
        MySwal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User information updated successfully!',
        });
        onClose();
      }
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the user information.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Update User Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        <div className="space-y-2">
          <label className="block font-semibold">First Name</label>
          <input 
            type="text" 
            required 
            name="firstName" 
            value={userData.firstName} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">Last Name</label>
          <input 
            type="text" 
            required 
            name="lastName" 
            value={userData.lastName} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">Phone Number</label>
          <input 
            type="text" 
            required 
            name="phone" 
            value={userData.phone} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">Street</label>
          <input 
            type="text" 
            required 
            name="street" 
            value={userData.address.street} 
            onChange={handleAddressChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">City</label>
          <input 
            type="text" 
            required 
            name="city" 
            value={userData.address.city} 
            onChange={handleAddressChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">State</label>
          <input 
            type="text" 
            required 
            name="state" 
            value={userData.address.state} 
            onChange={handleAddressChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">Postal Code</label>
          <input 
            type="text" 
            required 
            name="postalCode" 
            value={userData.address.postalCode} 
            onChange={handleAddressChange} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        {userData.role === 'seller' && (
          <div className="space-y-2">
            <label className="block font-semibold">Company Name</label>
            <input 
              type="text" 
              required 
              name="companyName" 
              value={userData.companyName} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">Update Info</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserInfo;

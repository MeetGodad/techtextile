"use client";
import React, { useState, useEffect } from 'react';

const OrderDetails = ({ userId, orderId, productId, onClose }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (userId && orderId && productId) {
      fetch(`/api/orderDetails/${userId}/${orderId}/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Order details not found');
          }
          return response.json();
        })
        .then(data => {
          setOrderDetails(data);
        })
        .catch(error => {
          console.error('Error fetching order details:', error);
        });
    }
  }, [userId, orderId, productId]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>Close</button>
        {orderDetails ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
            <p><strong>Product Name:</strong> {orderDetails.product_name}</p>
            <p><strong>Price:</strong> ${orderDetails.price}</p>
            <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
            <p><strong>Total Price:</strong> ${orderDetails.order_total_price}</p>
            <p><strong>Order Status:</strong> {orderDetails.order_status}</p>
            <p><strong>Ordered At:</strong> {new Date(orderDetails.created_at).toLocaleString()}</p>
            <p><strong>Shipping Address:</strong> {orderDetails.street}, {orderDetails.city}, {orderDetails.state}, {orderDetails.postal_code}</p>
            {orderDetails.product_type === 'yarn' && (
              <p><strong>Yarn Material:</strong> {orderDetails.yarn_material}</p>
            )}
            {orderDetails.product_type === 'fabric' && (
              <>
                <p><strong>Fabric Print Tech:</strong> {orderDetails.fabric_print_tech}</p>
                <p><strong>Fabric Material:</strong> {orderDetails.fabric_material}</p>
              </>
            )}
          </>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
  
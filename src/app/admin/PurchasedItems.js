// Refrence - https://chatgpt.com/c/5f947589-837e-403b-8027-58a129d2d590

"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';

const PurchasedItems = () => {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchItems(filter);
    }
  }, [user, filter]);

  const fetchItems = (status) => {
    setIsLoading(true);
    let url = `/api/admin/${user.uid}`;
    if (status) {
      url += `?status=${status}`;
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const groupedItems = data.reduce((acc, item) => {
          const productIndex = acc.findIndex(i => i.product_id === item.product_id);
          if (productIndex > -1) {
            acc[productIndex].variants.push(item);
          } else {
            acc.push({ ...item, variants: [item] });
          }
          return acc;
        }, []);
        setItems(groupedItems);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching purchased items:', error);
        setItems([]);
        setIsLoading(false);
      });
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'canceled':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen p-8 text-black bg-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Purchased Items</h1>

      <div className="flex justify-center mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white text-black"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className={`grid grid-cols-1 gap-8 w-full transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {isLoading ? (
          <div className="py-2 text-center text-gray-500 col-span-full">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-2 text-center text-gray-500 col-span-full">No items found</div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="rounded-lg shadow-lg p-6 relative bg-white flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold">{item.product_name}</p>
                  <p className="text-sm text-gray-500">Order Date: {new Date(item.order_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Order ID: {item.order_id}</p>
                </div>
                <span className={`px-2 py-1 rounded ${getStatusClassName(item.order_status)}`}>{item.order_status}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex items-center justify-center">
                  <img src={item.image_url.split(',')[0]} alt={item.product_name} className="w-40 h-40 object-contain" />
                </div>
                <div className="col-span-2">
                  <p className="mb-2"><strong>Price:</strong> ${item.item_price}</p>
                  <p className="mb-2"><strong>Quantity:</strong> {item.quantity}</p>
                  <p className="mb-2"><strong>Total Cost:</strong> ${item.original_total_price}</p>
                  <p className="mb-2"><strong>Shipping Cost:</strong> ${item.original_shipping_cost}</p>
                  <h3 className="text-lg font-semibold mt-4">Variants:</h3>
                  {item.variants && item.variants.map((variant, idx) => (
                    <div key={idx} className="mt-2 flex items-center">
                      {variant.variant_attributes.split(',').map((attr, attrIdx) => {
                        const [key, value] = attr.split(':');
                        if (key.trim() === 'Color') {
                          return <span key={attrIdx} className="inline-block w-6 h-6 rounded-full ml-2" style={{ backgroundColor: value.trim() }}></span>;
                        }
                        return (
                          <p key={attrIdx} className="ml-2">
                            <strong>{key.trim()}:</strong> {value.trim()}
                          </p>
                        );
                      })}
                      <p className="ml-2"><strong>Quantity:</strong> {variant.quantity}</p>
                    </div>
                  ))}
                  <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Ship
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Buyer Info</h3>
                <p className="mb-2"><strong>Buyer:</strong> {item.buyer_first_name} {item.buyer_last_name}</p>
                <p className="mb-2"><strong>Email:</strong> {item.buyer_email}</p>
                <p className="mb-2"><strong>Address:</strong> {`${item.street}, ${item.city}, ${item.state} ${item.postal_code}`}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchasedItems;

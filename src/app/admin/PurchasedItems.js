"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';

const PurchasedItems = () => {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user) {
      fetchItems(filter, sort);
    }
  }, [user, filter, sort]);

  const fetchItems = (status, sort) => {
    setIsLoading(true);
    let url = `/api/admin/${user.uid}`;
    if (status) {
      url += `?status=${status}`;
    }
    if (sort) {
      url += `${status ? '&' : '?'}sort=${sort}`;
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
          const orderIndex = acc.findIndex(i => i.order_id === item.order_id);
          if (orderIndex > -1) {
            acc[orderIndex].products.push(item);
          } else {
            acc.push({ 
              order_id: item.order_id,
              order_status: item.order_status,
              original_total_price: item.original_total_price,
              original_shipping_cost: item.original_shipping_cost,
              order_date: item.order_date,
              buyer_first_name: item.buyer_first_name,
              buyer_last_name: item.buyer_last_name,
              buyer_email: item.buyer_email,
              street: item.street,
              city: item.city,
              state: item.state,
              postal_code: item.postal_code,
              products: [item]
            });
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen p-8 text-black bg-gray-50 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Purchased Items</h1>

      <div className="flex justify-between w-full max-w-4xl mb-4">
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg bg-white text-black"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
          </select>
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border rounded-lg bg-white text-black"
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-8 w-full transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {isLoading ? (
          <div className="py-2 text-center text-gray-500 col-span-full">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-2 text-center text-gray-500 col-span-full">No items found</div>
        ) : (
          currentItems.map((order, index) => (
            <div key={index} className="rounded-lg shadow-lg p-6 bg-white flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold">Order ID: {order.order_id}</p>
                  <p className="text-sm text-gray-500">Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded ${getStatusClassName(order.order_status)}`}>{order.order_status}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                {order.products.map((product, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 mb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      <div className="col-span-1 flex items-center justify-center">
                        <img src={product.image_url.split(',')[0]} alt={product.product_name} className="w-32 h-32 object-contain" />
                      </div>
                      <div className="col-span-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="mb-2">
                            <strong>Product Name:</strong> 
                            <span className="block">{product.product_name.split(' ').slice(0, Math.ceil(product.product_name.split(' ').length / 2)).join(' ')}</span>
                            <span className="block">{product.product_name.split(' ').slice(Math.ceil(product.product_name.split(' ').length / 2)).join(' ')}</span>
                          </p>
                          <span className={`px-2 py-1 rounded ${getStatusClassName(product.item_status)}`}>{product.item_status}</span>
                        </div>
                        <p className="mb-2"><strong>Price:</strong> ${Number(product.item_price).toFixed(2)}</p>
                        <p className="mb-2"><strong>Quantity:</strong> {product.quantity}</p>
                        <p className="mb-2"><strong>Total Cost:</strong> ${Number(order.original_total_price).toFixed(2)}</p>
                        <p className="mb-2"><strong>Shipping Cost:</strong> ${Number(order.original_shipping_cost).toFixed(2)}</p>
                        <h3 className="text-lg font-semibold mt-4">Variants:</h3>
                        <div className="flex flex-wrap">
                          {product.variant_attributes.split(',').map((attr, attrIdx) => {
                            const [key, value] = attr.split(':');
                            if (key.trim() === 'Color') {
                              return <span key={attrIdx} className="inline-block w-6 h-6 rounded-full ml-2" style={{ backgroundColor: value.trim() }} title={value.trim()}></span>;
                            }
                            return (
                              <p key={attrIdx} className="ml-2">
                                <strong>{key.trim()}:</strong> {value.trim()}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition duration-300">Ship</button>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold">Buyer Info</h3>
                <p className="mb-2"><strong>Buyer Name:</strong> {order.buyer_first_name} {order.buyer_last_name}</p>
                <p className="mb-2"><strong>Buyer Email:</strong> {order.buyer_email}</p>
                <p className="mb-2"><strong>Shipping Address:</strong> {`${order.street}, ${order.city}, ${order.state}, ${order.postal_code}`}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <nav>
          <ul className="flex justify-center">
            {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, index) => (
              <li key={index} className="mx-1">
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PurchasedItems;

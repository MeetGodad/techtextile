// "use client";
// import { useState, useEffect } from 'react';
// import { useUserAuth } from '../auth/auth-context';

// const PurchasedItems = () => {
//   const { user } = useUserAuth();
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     if (user) {
//       fetch(`/api/admin/${user.uid}/purchased-items`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setItems(data);
//         })
//         .catch((error) => {
//           console.error('Error fetching purchased items:', error);
//         });
//     }
//   }, [user]);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//       {items.length === 0 ? (
//         <div className="py-2 text-center text-gray-500">No items found</div>
//       ) : (
//         items.map((item, index) => (
//           <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative transition transform hover:scale-105">
//             <img src={item.image_url} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
//             <div className="mt-4">
//               <h2 className="text-lg font-semibold text-gray-800">{item.product_name}</h2>
//               <p className="text-gray-600 mt-2">${item.price}</p>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default PurchasedItems;



"use client";
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';

const PurchasedItems = () => {
  const { user } = useUserAuth();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/admin/${user.uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setItems(data);
          } else {
            setItems([]); // Ensure items is always an array
          }
        })
        .catch((error) => {
          console.error('Error fetching purchased items:', error);
          setItems([]); // Handle error by setting items to an empty array
        });
    }
  }, [user]);

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen p-8 text-black bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Purchased Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        {items.length === 0 ? (
          <div className="py-2 text-center text-gray-500 col-span-full">No items found</div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative transition transform hover:scale-105">
              <img src={item.image_url.split(',')[0]} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">{item.product_name}</h2>
                <p className="text-gray-600 mt-2">${item.price}</p>
                <button
                  className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  View More
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-1/2">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={handleCloseDetails}
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Product Information</h3>
              <p><strong>Name:</strong> {selectedItem.product_name}</p>
              <p><strong>Price:</strong> ${selectedItem.price}</p>
              <p><strong>Type:</strong> {selectedItem.product_type}</p>
              {selectedItem.product_type === 'yarn' && <p><strong>Yarn Material:</strong> {selectedItem.yarn_material}</p>}
              {selectedItem.product_type === 'fabric' && (
                <>
                  <p><strong>Fabric Print Tech:</strong> {selectedItem.fabric_print_tech}</p>
                  <p><strong>Fabric Material:</strong> {selectedItem.fabric_material}</p>
                </>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Buyer Information</h3>
              <p><strong>Name:</strong> {selectedItem.buyer_first_name} {selectedItem.buyer_last_name}</p>
              <p><strong>Email:</strong> {selectedItem.buyer_email}</p>
              <p><strong>Address:</strong> {`${selectedItem.street}, ${selectedItem.city}, ${selectedItem.state} ${selectedItem.postal_code}`}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Order Information</h3>
              <p><strong>Order ID:</strong> {selectedItem.order_id}</p>
              <p><strong>Total Price:</strong> ${selectedItem.order_total_price}</p>
              <p><strong>Status:</strong> {selectedItem.order_status}</p>
              <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            </div>
            <button className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
              Ship
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedItems;

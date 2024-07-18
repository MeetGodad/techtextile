// "use client";
// import React, { useState, useEffect } from 'react';
// import { useUserAuth } from '../auth/auth-context';

// const PurchasedItems = () => {
//   const { user } = useUserAuth();
//   const [items, setItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     if (user) {
//       fetch(`/api/admin/${user.uid}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (Array.isArray(data)) {
//             setItems(data);
//           } else {
//             setItems([]); // Ensure items is always an array
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching purchased items:', error);
//           setItems([]); // Handle error by setting items to an empty array
//         });
//     }
//   }, [user]);

//   const handleCloseDetails = () => {
//     setSelectedItem(null);
//   };

//   return (
//     <div className="min-h-screen p-8 text-black bg-gray-100 flex flex-col items-center">
//       <h1 className="text-4xl font-bold mb-8">Purchased Items</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
//         {items.length === 0 ? (
//           <div className="py-2 text-center text-gray-500 col-span-full">No items found</div>
//         ) : (
//           items.map((item, index) => (
//             <div key={index} className="bg-white rounded-lg shadow-lg p-4 relative transition transform hover:scale-105">
//               <img src={item.image_url.split(',')[0]} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
//               <div className="mt-4">
//                 <h2 className="text-lg font-semibold text-gray-800">{item.product_name}</h2>
//                 <p className="text-gray-600 mt-2">${item.price}</p>
//                 <button
//                   className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
//                   onClick={() => setSelectedItem(item)}
//                 >
//                   View More
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {selectedItem && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-lg relative w-1/2">
//             <button
//               className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
//               onClick={handleCloseDetails}
//             >
//               Close
//             </button>
//             <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold">Product Information</h3>
//               <p><strong>Name:</strong> {selectedItem.product_name}</p>
//               <p><strong>Price:</strong> ${selectedItem.price}</p>
//               <p><strong>Type:</strong> {selectedItem.product_type}</p>
//               {selectedItem.product_type === 'yarn' && <p><strong>Yarn Material:</strong> {selectedItem.yarn_material}</p>}
//               {selectedItem.product_type === 'fabric' && (
//                 <>
//                   <p><strong>Fabric Print Tech:</strong> {selectedItem.fabric_print_tech}</p>
//                   <p><strong>Fabric Material:</strong> {selectedItem.fabric_material}</p>
//                 </>
//               )}
//             </div>
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold">Buyer Information</h3>
//               <p><strong>Name:</strong> {selectedItem.buyer_first_name} {selectedItem.buyer_last_name}</p>
//               <p><strong>Email:</strong> {selectedItem.buyer_email}</p>
//               <p><strong>Address:</strong> {`${selectedItem.street}, ${selectedItem.city}, ${selectedItem.state} ${selectedItem.postal_code}`}</p>
//             </div>
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold">Order Information</h3>
//               <p><strong>Order ID:</strong> {selectedItem.order_id}</p>
//               <p><strong>Total Price:</strong> ${selectedItem.order_total_price}</p>
//               <p><strong>Status:</strong> {selectedItem.order_status}</p>
//               <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
//             </div>
//             <button className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
//               Ship
//             </button>
//           </div>
//         </div>
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
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
        setItems(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching purchased items:', error);
        setItems([]);
        setIsLoading(false);
      });
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    setShowFullDescription(false);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'canceled':
        return 'bg-gray-400 text-gray-700';
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-white text-gray-800';
      default:
        return 'bg-white text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-8 text-black bg-gray-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Purchased Items</h1>
      
      <div className="flex justify-center mb-4 space-x-2">
        <button 
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            filter === '' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'
          }`}
          onClick={() => setFilter('')}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            filter === 'pending' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'
          }`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            filter === 'confirmed' ? 'bg-green-700 text-white' : 'bg-green-500 text-white hover:bg-green-700'
          }`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition duration-300 ${
            filter === 'canceled' ? 'bg-gray-700 text-white' : 'bg-gray-500 text-white hover:bg-gray-700'
          }`}
          onClick={() => setFilter('canceled')}
        >
          Canceled
        </button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {isLoading ? (
          <div className="py-2 text-center text-gray-500 col-span-full">Loading...</div>
        ) : items.length === 0 ? (
          <div className="py-2 text-center text-gray-500 col-span-full">No items found</div>
        ) : (
          items.map((item, index) => (
            <div key={index} className={`rounded-lg shadow-lg p-4 relative transition transform hover:scale-105 ${getStatusClassName(item.order_status)}`}>
              <img src={item.image_url.split(',')[0]} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
              <div className="mt-4">
                <h2 className="text-lg font-semibold">{item.product_name}</h2>
                <p className="mt-2">${item.price}</p>
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
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-4xl">
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              onClick={handleCloseDetails}
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Product Information</h3>
                <p><strong>Name:</strong> {selectedItem.product_name}</p>
                <p><strong>Description:</strong> 
                  {showFullDescription ? selectedItem.product_description : `${selectedItem.product_description.split(' ').slice(0, 30).join(' ')}...`}
                  {selectedItem.product_description.split(' ').length > 30 && (
                    <button className="text-blue-500 ml-2" onClick={toggleDescription}>
                      {showFullDescription ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </p>
                <p><strong>Price:</strong> ${selectedItem.price}</p>
                <p><strong>Type:</strong> {selectedItem.product_type}</p>
                {selectedItem.product_type === 'yarn' && <p><strong>Yarn Material:</strong> {selectedItem.yarn_material}</p>}
                {selectedItem.product_type === 'fabric' && (
                  <>
                    <p><strong>Fabric Print Tech:</strong> {selectedItem.fabric_print_tech}</p>
                    <p><strong>Fabric Material:</strong> {selectedItem.fabric_material}</p>
                  </>
                )}
                <p><strong>Variant:</strong> 
                  <span className="inline-block w-6 h-6 rounded-full" style={{ backgroundColor: selectedItem.variant_attributes }}></span>
                </p>
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
                <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
                <p><strong>Item Price:</strong> ${selectedItem.item_price}</p>
                <p><strong>Shipping Cost:</strong> ${selectedItem.order_shhipping_cost}</p>
                <p><strong>Total Cost:</strong> ${selectedItem.order_total_price}</p>
                <p><strong>Order Status:</strong> {selectedItem.order_status}</p>
                <p><strong>Order Date:</strong> {new Date(selectedItem.order_date).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-center items-center">
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
                  Ship
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedItems;

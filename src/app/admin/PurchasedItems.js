// "use client";
// import React, { useState, useEffect } from 'react';
// import { useUserAuth } from '../auth/auth-context';

// const PurchasedItems = () => {
//   const { user } = useUserAuth();
//   const [items, setItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [filter, setFilter] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   useEffect(() => {
//     if (user) {
//       fetchItems(filter);
//     }
//   }, [user, filter]);

//   const fetchItems = (status) => {
//     setIsLoading(true);
//     let url = `/api/admin/${user.uid}`;
//     if (status) {
//       url += `?status=${status}`;
//     }

//     fetch(url, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setItems(Array.isArray(data) ? data : []);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching purchased items:', error);
//         setItems([]);
//         setIsLoading(false);
//       });
//   };

//   const handleCloseDetails = () => {
//     setSelectedItem(null);
//     setShowFullDescription(false);
//   };

//   const toggleDescription = () => {
//     setShowFullDescription(!showFullDescription);
//   };

//   const getStatusClassName = (status) => {
//     switch (status) {
//       case 'canceled':
//         return 'bg-gray-400 text-gray-700';
//       case 'pending':
//         return 'bg-blue-100 text-blue-700';
//       case 'confirmed':
//         return 'bg-white text-gray-800';
//       default:
//         return 'bg-white text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen p-8 text-black bg-gray-100 flex flex-col items-center">
//       <h1 className="text-4xl font-bold mb-8">Purchased Items</h1>
      
//       <div className="flex justify-center mb-4 space-x-2">
//         <button 
//           className={`px-4 py-2 rounded-lg transition duration-300 ${
//             filter === '' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'
//           }`}
//           onClick={() => setFilter('')}
//         >
//           All
//         </button>
//         <button 
//           className={`px-4 py-2 rounded-lg transition duration-300 ${
//             filter === 'pending' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700'
//           }`}
//           onClick={() => setFilter('pending')}
//         >
//           Pending
//         </button>
//         <button 
//           className={`px-4 py-2 rounded-lg transition duration-300 ${
//             filter === 'confirmed' ? 'bg-green-700 text-white' : 'bg-green-500 text-white hover:bg-green-700'
//           }`}
//           onClick={() => setFilter('confirmed')}
//         >
//           Confirmed
//         </button>
//         <button 
//           className={`px-4 py-2 rounded-lg transition duration-300 ${
//             filter === 'canceled' ? 'bg-gray-700 text-white' : 'bg-gray-500 text-white hover:bg-gray-700'
//           }`}
//           onClick={() => setFilter('canceled')}
//         >
//           Canceled
//         </button>
//       </div>

//       <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
//         {isLoading ? (
//           <div className="py-2 text-center text-gray-500 col-span-full">Loading...</div>
//         ) : items.length === 0 ? (
//           <div className="py-2 text-center text-gray-500 col-span-full">No items found</div>
//         ) : (
//           items.map((item, index) => (
//             <div key={index} className={`rounded-lg shadow-lg p-4 relative transition transform hover:scale-105 ${getStatusClassName(item.order_status)}`}>
//               <img src={item.image_url.split(',')[0]} alt={item.product_name} className="h-48 w-full object-cover rounded-t-lg" />
//               <div className="mt-4">
//                 <h2 className="text-lg font-semibold">{item.product_name}</h2>
//                 <p className="mt-2">${item.price}</p>
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
//           <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-4xl">
//             <button
//               className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
//               onClick={handleCloseDetails}
//             >
//               Close
//             </button>
//             <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="mb-4">
//                 <h3 className="text-lg font-semibold">Product Information</h3>
//                 <p><strong>Name:</strong> {selectedItem.product_name}</p>
//                 <p><strong>Description:</strong> 
//                   {showFullDescription ? selectedItem.product_description : `${selectedItem.product_description.split(' ').slice(0, 30).join(' ')}...`}
//                   {selectedItem.product_description.split(' ').length > 30 && (
//                     <button className="text-blue-500 ml-2" onClick={toggleDescription}>
//                       {showFullDescription ? 'Show Less' : 'Show More'}
//                     </button>
//                   )}
//                 </p>
//                 <p><strong>Price:</strong> ${selectedItem.price}</p>
//                 <p><strong>Type:</strong> {selectedItem.product_type}</p>
//                 {selectedItem.product_type === 'yarn' && <p><strong>Yarn Material:</strong> {selectedItem.yarn_material}</p>}
//                 {selectedItem.product_type === 'fabric' && (
//                   <>
//                     <p><strong>Fabric Print Tech:</strong> {selectedItem.fabric_print_tech}</p>
//                     <p><strong>Fabric Material:</strong> {selectedItem.fabric_material}</p>
//                   </>
//                 )}
//                 <p><strong>Variant:</strong> 
//                   <span className="inline-block w-6 h-6 rounded-full" style={{ backgroundColor: selectedItem.variant_attributes }}></span>
//                 </p>
//               </div>
//               <div className="mb-4">
//                 <h3 className="text-lg font-semibold">Buyer Information</h3>
//                 <p><strong>Name:</strong> {selectedItem.buyer_first_name} {selectedItem.buyer_last_name}</p>
//                 <p><strong>Email:</strong> {selectedItem.buyer_email}</p>
//                 <p><strong>Address:</strong> {`${selectedItem.street}, ${selectedItem.city}, ${selectedItem.state} ${selectedItem.postal_code}`}</p>
//               </div>
//               <div className="mb-4">
//                 <h3 className="text-lg font-semibold">Order Information</h3>
//                 <p><strong>Order ID:</strong> {selectedItem.order_id}</p>
//                 <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
//                 <p><strong>Item Price:</strong> ${selectedItem.item_price}</p>
//                 <p><strong>Shipping Cost:</strong> ${selectedItem.order_shhipping_cost}</p>
//                 <p><strong>Total Cost:</strong> ${selectedItem.order_total_price}</p>
//                 <p><strong>Order Status:</strong> {selectedItem.order_status}</p>
//                 <p><strong>Order Date:</strong> {new Date(selectedItem.order_date).toLocaleDateString()}</p>
//               </div>
//               <div className="flex justify-center items-center">
//                 <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
//                   Ship
//                 </button>
//               </div>
//             </div>
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
            <div key={index} className={`rounded-lg shadow-lg p-6 relative transition transform hover:scale-105 ${getStatusClassName(item.order_status)} flex flex-col lg:flex-row`}>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded ${getStatusClassName(item.order_status)}`}>{item.order_status}</span>
              </div>
              <div className="lg:w-1/3 flex items-center justify-center mb-4 lg:mb-0">
                <img src={item.image_url.split(',')[0]} alt={item.product_name} className="max-w-full max-h-40 object-contain" />
              </div>
              <div className="lg:w-2/3 flex flex-col lg:flex-row lg:border-r lg:border-gray-300 lg:pr-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold whitespace-normal break-words">{item.product_name}</h2>
                  {item.variants.map((variant, idx) => (
                    <div key={idx} className="mt-2">
                      <p className="mt-2"><strong>Price:</strong> ${variant.price}</p>
                      <p className="mt-2"><strong>Quantity:</strong> {variant.quantity}</p>
                      <p className="mt-2"><strong>Variant:</strong> <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: variant.variant_attributes.split(',')[0].split(': ')[1] }}></span></p>
                    </div>
                  ))}
                  <p className="mt-2"><strong>Order Date:</strong> {new Date(item.order_date).toLocaleDateString()}</p>
                  <p className="mt-2"><strong>Order ID:</strong> {item.order_id}</p>
                  <p className="mt-2"><strong>Item Price:</strong> ${item.item_price}</p>
                  <p className="mt-2"><strong>Shipping Cost:</strong> ${item.original_shipping_cost}</p>
                  <p className="mt-2"><strong>Total Cost:</strong> ${item.original_total_price}</p>
                  <button className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition duration-300">
                    Ship
                  </button>
                </div>
                <div className="flex-1 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-300 mt-4 lg:mt-0 pt-4 lg:pt-0">
                  <h3 className="text-lg font-semibold">Buyer Info</h3>
                  <p className="mt-2"><strong>Buyer:</strong> {item.buyer_first_name} {item.buyer_last_name}</p>
                  <p className="mt-2"><strong>Email:</strong> {item.buyer_email}</p>
                  <p className="mt-2"><strong>Address:</strong> {`${item.street}, ${item.city}, ${item.state} ${item.postal_code}`}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchasedItems;

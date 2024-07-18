// import React from 'react';

// const PurchasedItemDetails = ({ item, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg relative w-1/2">
//         <button
//           className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
//           onClick={onClose}
//         >
//           Close
//         </button>
//         <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold">Product Information</h3>
//           <p><strong>Name:</strong> {item.product_name}</p>
//           <p><strong>Price:</strong> ${item.price}</p>
//           <p><strong>Type:</strong> {item.product_type}</p>
//           {item.product_type === 'yarn' && <p><strong>Yarn Material:</strong> {item.yarn_material}</p>}
//           {item.product_type === 'fabric' && (
//             <>
//               <p><strong>Fabric Print Tech:</strong> {item.fabric_print_tech}</p>
//               <p><strong>Fabric Material:</strong> {item.fabric_material}</p>
//             </>
//           )}
//         </div>
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold">Buyer Information</h3>
//           <p><strong>Name:</strong> {item.buyer_first_name} {item.buyer_last_name}</p>
//           <p><strong>Email:</strong> {item.buyer_email}</p>
//           <p><strong>Address:</strong> {item.street}, {item.city}, {item.state} {item.postal_code}</p>
//         </div>
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold">Order Information</h3>
//           <p><strong>Order ID:</strong> {item.order_id}</p>
//           <p><strong>Total Price:</strong> ${item.order_total_price}</p>
//           <p><strong>Status:</strong> {item.order_status}</p>
//           <p><strong>Quantity:</strong> {item.quantity}</p>
//         </div>
//         <button className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300">
//           Ship
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PurchasedItemDetails;

// import React, { useState, useEffect } from 'react';

// const OrderHistory = ({ userId }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (userId) {
//       fetch(`/api/history/${userId}`)
//         .then(response => response.json())
//         .then(data => {
//           setOrders(data);
//           setLoading(false);
//         })
//         .catch(error => {
//           setError(error);
//           setLoading(false);
//         });
//     }
//   }, [userId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error fetching data: {error.message}</div>;
//   }


//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//       {error ? (
//         <p className="text-red-500">{error}</p>
//       ) : orderDetails ? (
//         <div className="space-y-2">
//           <p><strong>Order ID:</strong> {orderDetails.order_id}</p>
//           <p><strong>Total Price:</strong> ${orderDetails.order_total_price}</p>
//           <p><strong>Status:</strong> {orderDetails.order_status}</p>
//           <p><strong>Product Name:</strong> {orderDetails.product_name}</p>
//           <p><strong>Price:</strong> ${orderDetails.price}</p>
//           <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
//           {orderDetails.product_type === 'yarn' && (
//             <p><strong>Yarn Material:</strong> {orderDetails.yarn_material}</p>
//           )}
//           {orderDetails.product_type === 'fabric' && (
//             <>
//               <p><strong>Fabric Print Tech:</strong> {orderDetails.fabric_print_tech}</p>
//               <p><strong>Fabric Material:</strong> {orderDetails.fabric_material}</p>
//             </>
//           )}
//           <p><strong>Shipping Address:</strong> {orderDetails.street}, {orderDetails.city}, {orderDetails.state} {orderDetails.postal_code}</p>
//         </div>
//       ) : (
//         <p className="text-gray-500">No details available</p>
//       )}
//       <button
//         onClick={onClose}
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//       >
//         Close
//       </button>
//     </div>
//   );
// };

// export default OrderDetails;


import React, { useState, useEffect } from 'react';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`/api/history/${userId}`)
        .then(response => response.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <div className="w-full min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="w-full min-h-screen flex items-center justify-center">Error fetching data: {error.message}</div>;
  }

  return (
    <div className="w-full min-h-screen p-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {orders.map((order, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4 transition transform hover:scale-105">
                <h3 className="text-lg font-semibold mb-2">Order ID: {order.order_id}</h3>
                <p className="text-gray-600 mb-2"><strong>Product Name:</strong> {order.product_name}</p>
                <p className="text-gray-600 mb-2"><strong>Quantity:</strong> {order.quantity}</p>
                <p className="text-gray-600 mb-2"><strong>Price:</strong> ${order.price}</p>
                <p className="text-gray-600 mb-2"><strong>Order Status:</strong> {order.order_status}</p>
                <p className="text-gray-600 mb-2"><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-2"><strong>Product Type:</strong> {order.product_type}</p>
                {order.yarn_material && <p className="text-gray-600 mb-2"><strong>Yarn Material:</strong> {order.yarn_material}</p>}
                {order.fabric_print_tech && <p className="text-gray-600 mb-2"><strong>Fabric Print Tech:</strong> {order.fabric_print_tech}</p>}
                {order.fabric_material && <p className="text-gray-600 mb-2"><strong>Fabric Material:</strong> {order.fabric_material}</p>}
                {order.image_url && <img src={order.image_url} alt={order.product_name} className="w-32 h-32 object-cover mt-4 rounded-lg" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;


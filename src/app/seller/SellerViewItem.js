"use client"
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
const SellerViewItem = () => {
  const [items, setItems] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/seller/${user.uid}`);
          const data = await response.json();
          console.log('response2:', data)
          setItems(data);
        } catch (error) {
          console.error('Error fetching the products:', error);
        }
      };
      fetchProducts();
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-white p-8 text-black">
      <section className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Listed Items</h1>
          <p className="mt-4 text-black">Listed Items</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between text-left text-sm font-medium">
            <span>Image</span>
            <span>Product Name</span>
            <span>Description</span>
            <span>Price</span>
            <span>Actions</span>
          </div>
          {items.length === 0 ? (
            <div className="py-2">No items found</div>
          ) : (
            items.map(item => (
              <div key={item.product_id} className="flex justify-between items-center py-2 border-b border-gray-300">
                <img src={item.image_url} alt={item.product_description} className="h-16 w-24 object-cover rounded-md" />
                <span>{item.product_description}</span>
                <span>{item.product_type}</span>
                <span>{item.variant}</span>
                <span>${item.price}</span>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Update</button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <button onClick={() => window.location.href='/listProduct'} className="mt-8 mb-12 px-4 py-2 bg-green-500 text-white rounded-md">
          Add Item
        </button>   
      </section>
    </div>
  );
};

export default SellerViewItem;


// "use client"
// import React, { useState, useEffect } from 'react';

// const SellerViewItem = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch(`/api/DisplayData_Api`);
//         const data = await response.json();
//         console.log('Fetched data:', data);
//         setItems(data.items || []);
//       } catch (error) {
//         console.error('Error fetching items:', error);
//       }
//     };
//     fetchItems();
//   }, []);

//   return (
//     <div>
//       <h1>Listed Items</h1>
//       {items.length === 0 ? (
//         <div>No items found</div>
//       ) : (
//         <ul>
//           {items.map((item, index) => (
//             <li key={index}>{item.product_name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SellerViewItem;

// this code is genrated by chat gpt 
// "use client"
// import React, { useState, useEffect } from 'react';

// const SellerViewItem = () => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch('/api/display_data/route');  // Ensure this matches the actual API endpoint path
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         console.log('Fetched data:', data);
//         setItems(data.items || []);
//       } catch (error) {
//         console.error('Error fetching items:', error);
//       }
//     };
//     fetchItems();
//   }, []);

//   return (
//     <div>
//       <h1>Listed Items</h1>
//       {items.length === 0 ? (
//         <div>No items found</div>
//       ) : (
//         <ul>
//           {items.map((item, index) => (
//             <li key={index}>{item.product_name}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SellerViewItem;

// "use client";
// import { useEffect, useState } from 'react';
// import { useUserAuth } from "../auth/auth-context";  // Make sure the path is correct

// export default function SellerViewItem() {
//     const { user } = useUserAuth();
//     const [products, setProducts] = useState([]);
//     const [message, setMessage] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!user) {
//                 setMessage('Please log in first!');
//                 return;
//             }
//             try {
//                 const response = await fetch('/api/products');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 if (data.length === 0) {
//                     setMessage('Not listed to sell!!');
//                 } else {
//                     setProducts(data);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch products:', error);
//                 setMessage('Failed to fetch products');
//             }
//         };

//         fetchData();
//     }, [user]);

//     if (message) {
//         return <div style={{ color: 'red' }}>{message}</div>;
//     }

//     return (
//         <div>
//             <h2>Listed Items</h2>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Product Name</th>
//                         <th>Description</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {products.map((product) => (
//                         <tr key={product.product_name}>
//                             <td>{product.product_name}</td>
//                             <td>{product.product_description}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

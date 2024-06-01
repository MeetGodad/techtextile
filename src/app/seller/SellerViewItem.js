// "use client"
// import React, { useState, useEffect } from 'react';
// import Header from '../components/Navbar';
// import Footer from '../components/Footer';
// import { useUserAuth } from '../auth/auth-context';

// const SellerViewItem = () => {
//   const [items, setItems] = useState([]);
//   const { user } = useUserAuth();

//   useEffect(() => {
//     const fetchItems = async () => {
//       if (user) {
//         try {
//           console.log('Fetching items for userId:', user.uid);
//           const response = await fetch(`/api/DisplayData_Api?userId=${user.uid}`);
//           const data = await response.json();
//           console.log('Fetched data:', data);
//           setItems(data.items || []);
//         } catch (error) {
//           console.error('Error fetching items:', error);
//         }
//       }
//     };
//     fetchItems();
//   }, [user]);

//   return (
//     <div className="w-full bg-white flex flex-col items-start justify-start pt-0 px-0 pb-[166.4px] box-border gap-[108px]">
//       <Header />
//       <section className="w-[1408px] flex flex-col items-start justify-start py-0 px-5 box-border max-w-full text-center text-[40px] text-black font-inter">
//         <div className="self-stretch flex flex-col items-start justify-start gap-[20px]">
//           <h1 className="text-inherit font-bold">Listed Items</h1>
//           <input
//             type="text"
//             placeholder="Search Items"
//             className="w-full py-2 px-3 border border-gray-300 rounded-md"
//           />
//           <div className="self-stretch flex flex-col items-start justify-start gap-[10.5px]">
//             <div className="flex flex-row items-start justify-between py-0 px-5 max-w-full text-left text-mini">
//               <span>Description</span>
//               <span>Category</span>
//               <span>Variant</span>
//               <span>Price</span>
//               <span>Actions</span>
//             </div>
//             {items.length === 0 ? (
//               <div className="py-2 px-5">No items found</div>
//             ) : (
//               items.map(item => (
//                 <div key={item.product_id} className="flex flex-row items-start justify-between py-2 px-5 border-b border-gray-300 max-w-full">
//                   <img src={item.image_url} alt={item.product_description} className="h-[63.8px] w-[95px] object-cover rounded-md" />
//                   <span>{item.product_description}</span>
//                   <span>{item.product_type}</span>
//                   <span>{item.variant}</span>
//                   <span>${item.price}</span>
//                   <div className="flex flex-row items-start justify-start gap-[15px] text-center">
//                     <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Update</button>
//                     <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//           <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">Add Item</button>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default SellerViewItem;

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

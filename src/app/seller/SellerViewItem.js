// "use client"
// import React, { useState, useEffect } from 'react';
// import { useUserAuth } from '../auth/auth-context';
// const SellerViewItem = () => {
//   const [items, setItems] = useState([]);
//   const { user } = useUserAuth();

//   useEffect(() => {
//       fetchProducts();

//     const handleFetchSellerData = () => {
//       fetchProducts();
//       console.log('Seller data updated with EventListener');
//     }

//     window.addEventListener('sellerDataUpdated', handleFetchSellerData);


//     return () => {
//       window.removeEventListener('sellerDataUpdated', handleFetchSellerData);
//     }

//   }, [user]);

//   const fetchProducts = async () => {
//     try {
//       if (user) {
//         const userId = user.uid;
//         fetch(`/api/seller/${userId}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//           .then(response => {
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             return response.json();
//           })
//           .then(data => {
//             if (data && typeof data === 'object') {
//               setItems(data);
//             } else {
//               console.error('Server response is not an object:', data);
//             }
//           })
//           .catch(error => {
//             console.error('Unexpected server response:', error);
//           });
//       }
//     } catch (error) {
//       console.error('Error fetching the items:', error);
//     }
//   };


//   return (
//     <div className="w-full min-h-screen bg-white p-8 text-black">
//       <section className="max-w-screen-xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold">Listed Items</h1>
//         </div>
//         <div className="grid grid-cols-1 gap-4">
//           <div className="flex justify-between text-left text-sm font-medium">
//             <span>Image</span>
//             <span>Product Name</span>
//             <span>Description</span>
//             <span>Price</span>
//             <span>Actions</span>
//           </div>
//           {items.length === 0 ? (
//             <div className="py-2">No items found</div>
//           ) : (
//             items.map(item => (
//               <div key={item.product_id} className="flex justify-between items-center py-2 border-b border-gray-300">
//                 <img src={item.image_url} alt={item.product_description} className="h-16 w-24 object-cover rounded-md" />
//                 <span>{item.product_description}</span>
//                 <span>{item.product_type}</span>
//                 <span>{item.variant}</span>
//                 <span>${item.price}</span>
//                 <div className="flex space-x-4">
//                   <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Update</button>
//                   <button className="px-4 py-2 bg-red-500 text-white rounded-md">Remove</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         <button onClick={() => window.location.href='/listProduct'} className="mt-8 mb-12 px-4 py-2 bg-green-500 text-white rounded-md">
//           Add Item
//         </button>   
//       </section>
//     </div>
//   );
// };

// export default SellerViewItem;

"use client"
import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';

const SellerViewItem = () => {
  const [items, setItems] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
      fetchProducts();

    const handleFetchSellerData = () => {
      fetchProducts();
      console.log('Seller data updated with EventListener');
    }

    window.addEventListener('sellerDataUpdated', handleFetchSellerData);

    return () => {
      window.removeEventListener('sellerDataUpdated', handleFetchSellerData);
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const response = await fetch(`/api/seller/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error('Server response is not an array:', data);
          setItems([]); // Ensure items is always an array
        }
      }
    } catch (error) {
      console.error('Error fetching the items:', error);
      setItems([]); // Ensure items is always an array in case of an error
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 text-black">
      <section className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Listed Items</h1>
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

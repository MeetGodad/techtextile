// "use client";
// import  { useEffect, useState } from 'react';
// import {useUserAuth} from '../auth/auth-context';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import SellerViewItem from '../seller/SellerViewItem';


// export default function Profile() {
//     const { user , firebaseSignOut  } = useUserAuth();
//   const [userDetails, setUserDetails] = useState(null);
//   const [buyerInfo, setBuyerInfo] = useState(null);
//   const [sellerInfo, setSellerInfo] = useState(null);
//   const router = useRouter();
  

  

//   useEffect(() => {

//     if(!user){
//       console.log("User is not logged in");
//       return;
//     }

//     const userId = user.uid;
//     console.log("User Id : " , userId);
  
//     if (userId !== null) {
//       fetch(`api/Profile/${userId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//       .then(response => {
//         console.log("Backend Response : " , response);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         console.log(data);
//         setUserDetails(data.user);
//         console.log("User Details : " , userDetails);
//         if (data.user.user_type === 'seller') {
//           setSellerInfo(data.user.sellerDetails);
//         } else if (data.user.user_type === 'buyer') {
//           setBuyerInfo(data.user.buyerDetails);
//         }
//       })
//       .catch(error => {
//         console.error('Unexpected server response:', error);
//       });
//     }
//   }, [user]);


//   if (!user) {
//     router.push('/Home');
//   }

//   return (

//     user && userDetails && (
//     <div className="min-h-screen bg-gray-100 p-4 text-black">
//       <header className="bg-white text-black shadow p-4 flex flex-col items-center">
//       <h1 className="text-2xl font-semibold mt-4">{userDetails.first_name} {userDetails.last_name}</h1>
//       </header>

//       <main className="mt-6 bg-white text-black shadow p-4 rounded">
//         <section className="mb-6">
//           <h2 className="text-xl font-semibold border-b pb-2 mb-4">User Information</h2>
//           <p><strong>Email:</strong> {userDetails.email}</p>
//           <button
//             onClick={firebaseSignOut}
//            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Sign Out</button>
//         </section>

//         {userDetails.user_type === 'buyer' && buyerInfo && (
//           <section className="mb-6">

//             <p><strong>Phone Number:</strong> {buyerInfo.phone_num}</p>
//             <p><strong>Shipping Address:</strong> {buyerInfo.shipping_address}</p>
//             /*
//               <h2 className="text-xl font-semibold border-b pb-2 mb-4 mt-6">Order History</h2>
//               <ul>
//                 <li>Order 1</li>
//                 <li>Order 2</li>
//               </ul>
//               <h2 className="text-xl font-semibold border-b pb-2 mb-4 mt-6">Wishlist</h2>
//               {/* Add Wishlist Data */}
//               <ul>
//                 <li>Wishlist Item 1</li>
//                 <li>Wishlist Item 2</li>
//               </ul>
//             */
//           </section>
//         )}

//         {userDetails && userDetails.user_type === 'seller' && sellerInfo && (
//           <section>
//             <p><strong>Business Name:</strong> {sellerInfo.business_name}</p>
//             <p><strong>Business Address:</strong> {sellerInfo.business_address}</p>
//             <p><strong>Business Phone Number:</strong> {sellerInfo.phone_num}</p>

//           <Link href="/listProduct" >
//             <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
//           </Link>  
          
//              {/* <h2 className="text-xl font-semibold border-b pb-2 mb-4">Listed Products</h2>
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="py-2">Product Name</th>
//                     <th className="py-2">Category</th>
//                     <th className="py-2">Price</th>
//                     <th className="py-2">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
                  
//                   {sellerInfo.products && sellerInfo.products.map((product, index) => (
//                     <tr key={index} className="text-left border-b">
//                       <td className="py-2 px-4">{product.name}</td>
//                       <td className="py-2 px-4">{product.category}</td>
//                       <td className="py-2 px-4">{product.price}</td>
//                       <td className="py-2 px-4">
//                         <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Update</button>
//                         <button className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 </table>
//                 <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add New Product</button>
//                 */}
//           </section>
//         )}
//       </main>
    
//     </div>
//     ) );
// };

"use client";
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { useRouter } from 'next/navigation';
import SellerViewItem from '../seller/SellerViewItem';

export default function Profile() {
  const { user, firebaseSignOut } = useUserAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [showListedItems, setShowListedItems] = useState(false); 
  const router = useRouter(); 

  useEffect(() => {
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    const userId = user.uid;
    console.log("User Id : ", userId);

    if (userId !== null) {
      fetch(`api/Profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log("Backend Response : ", response);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          setUserDetails(data.user);
          console.log("User Details : ", userDetails);
          if (data.user.user_type === 'seller') {
            setSellerInfo(data.user.sellerDetails);
          }
        })
        .catch(error => {
          console.error('Unexpected server response:', error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/Home');
    }
  }, [user, router]);

  const handleViewListedItems = () => {
    setShowListedItems(!showListedItems); 
  };

  return (
    user && userDetails && (
      <div className="min-h-flex bg-gray-100 p-4 flex flex-col sm:flex-row"> 
        <main className="w-full sm:w-1/4 bg-white text-black shadow p-6 rounded-lg mr-10"> 
          <section className="mb-6 p-2">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">User Information</h2>
            <p className="text-lg"><strong>Email:</strong> {userDetails.email}</p>
            <button onClick={firebaseSignOut} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">Sign Out</button>
          </section>

          {userDetails.user_type === 'buyer' && buyerInfo && (
            <section className="mb-6 p-2">
              <p className="text-lg"><strong>Phone Number:</strong> {buyerInfo.phone_num}</p>
              <p className="text-lg"><strong>Shipping Address:</strong> {buyerInfo.shipping_address}</p>
            </section>
          )}

          {userDetails && userDetails.user_type === 'seller' && sellerInfo && (
            <section className="p-2">
              <p className="text-lg"><strong>Business Name:</strong> {sellerInfo.business_name}</p>
              <p className="text-lg"><strong>Business Address:</strong> {sellerInfo.business_address}</p>
              <p className="text-lg"><strong>Business Phone Number:</strong> {sellerInfo.phone_num}</p>
              <button onClick={handleViewListedItems} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
                View Listed Items
              </button>
            </section>
          )}
        </main>

        {showListedItems && (
          <aside className="w-full sm:w-1/2 bg-white text-black shadow p-4 rounded-lg ml-10"> {/* Right box */}
            <SellerViewItem userId={user.uid} /> {/* Conditionally render SellerViewItem */}
          </aside>
        )}
      </div>
    )
  );
};

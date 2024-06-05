

// "use client";
// import { useEffect, useState } from 'react';
// import { useUserAuth } from '../auth/auth-context';
// import { useRouter } from 'next/navigation';
// import SellerViewItem from '../seller/SellerViewItem';

// export default function Profile() {
//   const { user, firebaseSignOut } = useUserAuth();
//   const [userDetails, setUserDetails] = useState(null);
//   const [buyerInfo, setBuyerInfo] = useState(null);
//   const [sellerInfo, setSellerInfo] = useState(null);
//   const [showListedItems, setShowListedItems] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       console.log("User is not logged in");
//       return;
//     }

//     const userId = user.uid;
//     console.log("User Id : ", userId);

//     if (userId !== null) {
//       fetch(`api/Profile/${userId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then(response => {
//           console.log("Backend Response : ", response);
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log(data);
//           setUserDetails(data.user);
//           console.log("User Details : ", userDetails);
//           if (data.user.user_type === 'seller') {
//             setSellerInfo(data.user.sellerDetails);
//           } else if (data.user.user_type === 'buyer') {
//             setBuyerInfo(data.user.buyerDetails);
//           }
//         })
//         .catch(error => {
//           console.error('Unexpected server response:', error);
//         });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!user) {
//       router.push('/Home');
//     }
//   }, [user, router]);

//   const handleViewListedItems = () => {
//     setShowListedItems(!showListedItems);
//   };

//   return (
//     user && userDetails && (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
//         <div className={`transition-all duration-500 ease-in-out flex ${showListedItems ? 'justify-start' : 'justify-center'} items-center w-full`}>
//           <main className={`relative bg-white text-black shadow p-6 rounded-lg overflow-y-auto transition-all duration-500 ease-in-out transform ${showListedItems ? 'ml-10 mr-0' : 'w-2/3'}`} style={{ width: showListedItems ? '30%' : '56%', height: 'auto' }}>
//             <section className="border p-4 rounded-lg mb-6">
//               <h1 className="text-4xl font-bold mb-4">Hello, {userDetails.first_name} 🙏</h1>
//               <h2 className="text-3xl font-semibold border-b pb-2 mb-4">User Information</h2>
//               <p className="text-xl"><strong>Email:</strong> {userDetails.email}</p>
//               <button onClick={firebaseSignOut} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">Sign Out</button>
//               {userDetails.user_type === 'seller' && sellerInfo && (
//                 <>
//                   <p className="text-xl mt-4"><strong>Business Name:</strong> {sellerInfo.business_name}</p>
//                   <p className="text-xl"><strong>Business Address:</strong> {sellerInfo.business_address}</p>
//                   <p className="text-xl"><strong>Business Phone Number:</strong> {sellerInfo.phone_num}</p>
//                   <button onClick={handleViewListedItems} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
//                     View Listed Items
//                   </button>
//                 </>
//               )}
//             </section>
//           </main>

//           {showListedItems && (
//             <aside className="bg-white text-black shadow p-6 rounded-lg transition-all duration-500 ease-in-out transform flex-1 ml-6">
//               <SellerViewItem userId={user.uid} />
//             </aside>
//           )}
//         </div>
//       </div>
//     )
//   );
// };

"use client";
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { useRouter } from 'next/navigation';
import SellerViewItem from '../seller/SellerViewItem';

export default function Profile() {
  const { user, firebaseSignOut } = useUserAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [showListedItems, setShowListedItems] = useState(false);
  const [listedItemsVisible, setListedItemsVisible] = useState(false);
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
          } else if (data.user.user_type === 'buyer') {
            setBuyerInfo(data.user.buyerDetails);
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
    if (!showListedItems) {
      setListedItemsVisible(true);
      setTimeout(() => setShowListedItems(true), 10); // small delay for transition
    } else {
      setShowListedItems(false);
      setTimeout(() => setListedItemsVisible(false), 1000); // wait for transition to end
    }
  };

  return (
    user && userDetails && (
      <div className="min-h-screen bg-gray-100 p-4 relative flex items-start justify-center">
        <main className={`transition-all duration-1000 ease-in-out transform ${showListedItems ? 'fixed top-15 left-0 m-2' : 'm-auto'}`} style={{ width: showListedItems ? '30%' : 'auto', height: 'auto', padding: '10px', boxSizing: 'border-box', marginTop: showListedItems ? '15px' : '0' }}>
          <section className="bg-white text-black shadow p-4 rounded-lg mb-6">
            <h1 className="text-4xl font-bold mb-4">Hello, {userDetails.first_name} 🙏</h1>
            <h2 className="text-3xl font-semibold border-b pb-2 mb-4">User Information</h2>
            <p className="text-xl"><strong>Email:</strong> {userDetails.email}</p>
            <button onClick={firebaseSignOut} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">Sign Out</button>
            {userDetails.user_type === 'seller' && sellerInfo && (
              <>
                <p className="text-xl mt-4"><strong>Business Name:</strong> {sellerInfo.business_name}</p>
                <p className="text-xl"><strong>Business Address:</strong> {sellerInfo.business_address}</p>
                <p className="text-xl"><strong>Business Phone Number:</strong> {sellerInfo.phone_num}</p>
                <button onClick={handleViewListedItems} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200">
                  View Listed Items
                </button>
              </>
            )}
          </section>
        </main>

        {listedItemsVisible && (
          <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showListedItems ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
            <SellerViewItem userId={user.uid} />
          </aside>
        )}
      </div>
    )
  );
}

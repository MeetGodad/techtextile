// "use client";
// import { useEffect, useState } from 'react';
// import { useUserAuth } from '../auth/auth-context';
// import { useRouter } from 'next/navigation';
// import SellerViewItem from '../seller/SellerViewItem';
// import ListProduct from '../seller/ListProduct';
// import UpdateUserInfo from './UpdateUserInfo';
// import PurchaseHistory from '../order/PurchaseHistory';
// import { AiOutlineEdit } from 'react-icons/ai';

// export default function Profile() {
//   const { user, firebaseSignOut } = useUserAuth();
//   const [userDetails, setUserDetails] = useState(null);
//   const [buyerInfo, setBuyerInfo] = useState(null);
//   const [sellerInfo, setSellerInfo] = useState(null);
//   const [showListedItems, setShowListedItems] = useState(false);
//   const [listedItemsVisible, setListedItemsVisible] = useState(false);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [showUpdateUser, setShowUpdateUser] = useState(false);
//   const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
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
//           if (data.user.user_type === 'seller') {
//             setSellerInfo({
//               business_name: data.user.business_name,
//               business_address: `${data.user.street}, ${data.user.city}, ${data.user.state} ${data.user.postal_code}`,
//               phone_num: data.user.phone_num
//             });
//           } else if (data.user.user_type === 'buyer') {
//             setBuyerInfo({
//               phone_num: data.user.phone_num,
//               address: `${data.user.street}, ${data.user.city}, ${data.user.state} ${data.user.postal_code}`
//             });
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

//   const handleAddProduct = () => {
//     if (!showAddProduct) {
//       setShowAddProduct(true);
//       setListedItemsVisible(false);
//       setShowUpdateUser(false);
//       setShowPurchaseHistory(false);
//       setTimeout(() => setShowAddProduct(true), 10);
//     } else {
//       setShowAddProduct(false);
//       setTimeout(() => setListedItemsVisible(false), 1000);
//     }
//   };

//   const handleViewListedItems = () => {
//     const event = new Event('sellerDataUpdated');
//     window.dispatchEvent(event);

//     if (!showListedItems) {
//       setListedItemsVisible(true);
//       setShowAddProduct(false);
//       setShowUpdateUser(false);
//       setShowPurchaseHistory(false);
//       setTimeout(() => setShowListedItems(true), 10);
//     } else {
//       setShowListedItems(false);
//       setTimeout(() => setListedItemsVisible(false), 1000); 
//     }
//   };

//   const handleUpdateUserInfo = () => {
//     if (!showUpdateUser) {
//       setShowUpdateUser(true);
//       setShowAddProduct(false);
//       setListedItemsVisible(false);
//       setShowPurchaseHistory(false);
//       setTimeout(() => setShowUpdateUser(true), 10);
//     } else {
//       setShowUpdateUser(false);
//       setTimeout(() => setShowUpdateUser(false), 1000);
//     }
//   };

//   const handleViewPurchaseHistory = () => {
//     if (!showPurchaseHistory) {
//       setShowPurchaseHistory(true);
//       setShowUpdateUser(false);
//       setShowAddProduct(false);
//       setListedItemsVisible(false);
//       setTimeout(() => setShowPurchaseHistory(true), 10);
//     } else {
//       setShowPurchaseHistory(false);
//       setTimeout(() => setShowPurchaseHistory(false), 1000);
//     }
//   };

//   return (
//     user && userDetails && (
//       <div className="min-h-screen bg-gray-100 p-4 relative flex items-start justify-center">
//         <main className={`transition-all duration-1000 ease-in-out transform ${showListedItems || showAddProduct || showUpdateUser || showPurchaseHistory ? 'absolute top-15 left-0 m-2' : 'm-auto'}`}    style={{ width: showListedItems || showAddProduct || showUpdateUser || showPurchaseHistory ? '30%' : 'auto', height: 'auto', padding: '10px', boxSizing: 'border-box', marginTop: showListedItems || showAddProduct || showUpdateUser || showPurchaseHistory ? '15px' : '0' }}>
//           <section className="bg-white text-black shadow p-4 rounded-lg mb-6 relative">
//             <h1 className="text-4xl font-bold mb-4">Hello, {userDetails.first_name} 🙏
//               <button onClick={handleUpdateUserInfo} className="absolute right-4 top-4">
//                 <AiOutlineEdit size={24} />
//               </button>
//             </h1>
//             <h2 className="text-3xl font-semibold border-b pb-2 mb-4">User Information</h2>
//             <p className="text-xl"><strong>Email:</strong> {userDetails.email}</p>
//             <p className="text-xl"><strong>Phone Number:</strong> {userDetails.phone_num}</p>
//             {userDetails.user_type === 'seller' && sellerInfo && (
//               <>
//                 <p className="text-xl mt-4"><strong>Business Name:</strong> {sellerInfo.business_name}</p>
//                 <p className="text-xl"><strong>Business Address:</strong> {sellerInfo.business_address}</p>
//               </>
//             )}
//             {userDetails.user_type === 'buyer' && buyerInfo && (
//               <>
//                 <p className="text-xl"><strong>Address:</strong> {buyerInfo.address}</p>
//               </>
//             )}
//             <button onClick={firebaseSignOut} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">Sign Out</button>
//             {userDetails.user_type === 'seller' && (
//               <>
//                 <button onClick={handleViewListedItems} className="flex mt-4 bg-green-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-green-600 transition-colors duration-200">
//                   View Listed Items
//                 </button>
//                 <button onClick={handleAddProduct} className="flex mt-4 bg-green-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-green-600 transition-colors duration-200">
//                   Add Product
//                 </button>
//               </>
//             )}
//             {userDetails.user_type === 'buyer' && (
//               <button onClick={handleViewPurchaseHistory} className="flex mt-4 bg-green-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-green-600 transition-colors duration-200">
//                 View Purchase History
//               </button>
//             )}
//           </section>
//         </main>

//         {userDetails.user_type === 'seller' && listedItemsVisible && (
//           <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showListedItems ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
//             <SellerViewItem userId={user.uid} />
//           </aside>
//         )}

//         {userDetails.user_type === 'seller' && showAddProduct && (
//           <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showAddProduct ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
//             <ListProduct userId={user.uid} />
//           </aside>
//         )}

//         {showUpdateUser && (
//           <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showUpdateUser ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
//             <UpdateUserInfo userDetails={userDetails} setShowUpdateUser={setShowUpdateUser} />
//           </aside>
//         )}

//         {userDetails.user_type === 'buyer' && showPurchaseHistory && (
//           <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showPurchaseHistory ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
//             <PurchaseHistory userId={user.uid} onClose={() => setShowPurchaseHistory(false)} />
//           </aside>
//         )}
//       </div>
//     )
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { useRouter } from 'next/navigation'; // Correctly import useRouter from next/router
import SellerViewItem from '../seller/SellerViewItem';
import ListProduct from '../seller/ListProduct';
import UpdateUserInfo from './UpdateUserInfo';
import PurchaseHistory from '../order/PurchaseHistory';
import { AiOutlineEdit } from 'react-icons/ai';

export default function Profile() {
  const { user, firebaseSignOut } = useUserAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [showListedItems, setShowListedItems] = useState(false);
  const [listedItemsVisible, setListedItemsVisible] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
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
          if (data.user.user_type === 'seller') {
            setSellerInfo({
              business_name: data.user.business_name,
              business_address: `${data.user.street}, ${data.user.city}, ${data.user.state} ${data.user.postal_code}`,
              phone_num: data.user.phone_num
            });
          } else if (data.user.user_type === 'buyer') {
            setBuyerInfo({
              phone_num: data.user.phone_num,
              address: `${data.user.street}, ${data.user.city}, ${data.user.state} ${data.user.postal_code}`
            });
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

  const handleAddProduct = () => {
    if (!showAddProduct) {
      setShowAddProduct(true);
      setListedItemsVisible(false);
      setShowUpdateUser(false);
      setShowPurchaseHistory(false);
      setTimeout(() => setShowAddProduct(true), 10);
    } else {
      setShowAddProduct(false);
      setTimeout(() => setListedItemsVisible(false), 1000);
    }
  };

  const handleViewListedItems = () => {
    const event = new Event('sellerDataUpdated');
    window.dispatchEvent(event);

    if (!showListedItems) {
      setListedItemsVisible(true);
      setShowAddProduct(false);
      setShowUpdateUser(false);
      setShowPurchaseHistory(false);
      setTimeout(() => setShowListedItems(true), 10);
    } else {
      setShowListedItems(false);
      setTimeout(() => setListedItemsVisible(false), 1000);
    }
  };

  const handleUpdateUserInfo = () => {
    if (!showUpdateUser) {
      setShowUpdateUser(true);
      setShowAddProduct(false);
      setListedItemsVisible(false);
      setShowPurchaseHistory(false);
      setTimeout(() => setShowUpdateUser(true), 10);
    } else {
      setShowUpdateUser(false);
      setTimeout(() => setShowUpdateUser(false), 1000);
    }
  };

  const handleViewPurchaseHistory = () => {
    if (!showPurchaseHistory) {
      setShowPurchaseHistory(true);
      setShowUpdateUser(false);
      setShowAddProduct(false);
      setListedItemsVisible(false);
      setTimeout(() => setShowPurchaseHistory(true), 10);
    } else {
      setShowPurchaseHistory(false);
      setTimeout(() => setShowPurchaseHistory(false), 1000);
    }
  };

  const handleGoToAdmin = () => {
    router.push('/admin');
  };

  return (
    user && userDetails && (
      <div className="min-h-screen bg-gray-100 p-4 relative flex items-start justify-center">
        <main className={`transition-all duration-1000 ease-in-out transform ${showListedItems || showAddProduct || showUpdateUser || showPurchaseHistory ? 'absolute top-15 left-0 m-2' : 'm-auto'}`}    style={{ width: showListedItems || showAddProduct || showUpdateUser || showPurchaseHistory ? '30%' : 'auto', height: 'auto', padding: '10px', boxSizing: 'border-box', marginTop: showListedItems || showAddProduct || showUpdateUser || showPurchaseHistory ? '15px' : '0' }}>
          <section className="bg-white text-black shadow p-4 rounded-lg mb-6 relative">
            <h1 className="text-4xl font-bold mb-4">Hello, {userDetails.first_name} 🙏
              <button onClick={handleUpdateUserInfo} className="absolute right-4 top-4">
                <AiOutlineEdit size={24} />
              </button>
            </h1>
            <h2 className="text-3xl font-semibold border-b pb-2 mb-4">User Information</h2>
            <p className="text-xl"><strong>Email:</strong> {userDetails.email}</p>
            <p className="text-xl"><strong>Phone Number:</strong> {userDetails.phone_num}</p>
            {userDetails.user_type === 'seller' && sellerInfo && (
              <>
                <p className="text-xl mt-4"><strong>Business Name:</strong> {sellerInfo.business_name}</p>
                <p className="text-xl"><strong>Business Address:</strong> {sellerInfo.business_address}</p>
              </>
            )}
            {userDetails.user_type === 'buyer' && buyerInfo && (
              <>
                <p className="text-xl"><strong>Address:</strong> {buyerInfo.address}</p>
              </>
            )}
            <button onClick={firebaseSignOut} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">Sign Out</button>
      
            {userDetails.user_type === 'seller' && (
              <>
                <button onClick={handleViewListedItems} className="flex mt-4 bg-green-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-green-600 transition-colors duration-200">
                  View Listed Items
                </button>
                <button onClick={handleAddProduct} className="flex mt-4 bg-green-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-green-600 transition-colors duration-200">
                  Add Product
                </button>
                <button onClick={() => router.push('/admin')} className="flex mt-4 bg-purple-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-purple-600 transition-colors duration-200">
                  Admin Dashbord
                </button>
              </>
            )}

            {userDetails.user_type === 'buyer' && (
              <button onClick={handleViewPurchaseHistory} className="flex mt-4 bg-green-500 text-white px-6 py-3 w-1/2 justify-center rounded-lg hover:bg-green-600 transition-colors duration-200">
                View Purchase History
              </button>
            )}
          </section>
        </main>

        {userDetails.user_type === 'seller' && listedItemsVisible && (
          <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showListedItems ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
            <SellerViewItem userId={user.uid} />
          </aside>
        )}

        {userDetails.user_type === 'seller' && showAddProduct && (
          <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showAddProduct ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
            <ListProduct userId={user.uid} />
          </aside>
        )}

        {showUpdateUser && (
          <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showUpdateUser ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
            <UpdateUserInfo userDetails={userDetails} setShowUpdateUser={setShowUpdateUser} />
          </aside>
        )}

        {userDetails.user_type === 'buyer' && showPurchaseHistory && (
          <aside className={`bg-white text-black shadow p-4 rounded-lg ml-4 transition-all duration-1000 ease-in-out transform ${showPurchaseHistory ? 'scale-100' : 'scale-0'}`} style={{ marginLeft: 'calc(30% + 20px)', flexGrow: 1 }}>
            <PurchaseHistory userId={user.uid} onClose={() => setShowPurchaseHistory(false)} />
          </aside>
        )}
      </div>
    )
  );
}

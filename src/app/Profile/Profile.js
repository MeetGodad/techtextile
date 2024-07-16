"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '../auth/auth-context';
import UpdateUserInfo from './UpdateUserInfo';
import PurchaseHistory from '../order/PurchaseHistory';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Profile() {
  const { user, firebaseSignOut } = useUserAuth();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [showListedItems, setShowListedItems] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

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
              phone_num: data.user.seller_phone_num
            });
          } else if (data.user.user_type === 'buyer') {
            setBuyerInfo({
              phone_num: data.user.buyer_phone_num,
              address: `${data.user.street}, ${data.user.city}, ${data.user.state} ${data.user.postal_code}`
            });
          }
        })
        .catch(error => {
          console.error('Unexpected server response:', error);
        });
    }
  }, [user]);

  const handleUpdateUserInfo = () => {
    setShowProfile(false);
    setShowUpdateUser(true);
    setShowAddProduct(false);
    setShowListedItems(false);
    setShowPurchaseHistory(false);
    setShowAdminDashboard(false);
  };

  const handleViewPurchaseHistory = () => {
    setShowProfile(false);
    setShowPurchaseHistory(true);
    setShowUpdateUser(false);
    setShowAddProduct(false);
    setShowListedItems(false);
    setShowAdminDashboard(false);
  };

  const handleGoToAdmin = () => {
    router.push('/admin');
  };

  const handleShowProfile = () => {
    setShowProfile(true);
    setShowUpdateUser(false);
    setShowAddProduct(false);
    setShowListedItems(false);
    setShowPurchaseHistory(false);
    setShowAdminDashboard(false);
  };

  return (
    user && userDetails && (
      <div className="min-h-screen bg-gray-100 flex">
        <aside className={`transition-transform duration-500 ease-in-out ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0`}>
          <button onClick={() => setSidebarVisible(!sidebarVisible)} className="text-white absolute top-4 right-4 lg:hidden">
            {sidebarVisible ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <nav>
            <h1 className="text-2xl font-semibold mb-6">Profile</h1>
            <ul>
              <li>
                <button onClick={handleShowProfile} className={`block py-2.5 px-4 rounded transition duration-200 ${showProfile ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                  Profile
                </button>
              </li>
              {userDetails.user_type === 'seller' && (
                <>
                  <li>
                    <button onClick={handleGoToAdmin} className={`block py-2.5 px-4 rounded transition duration-200 ${showAdminDashboard ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                      Admin Dashboard
                    </button>
                  </li>
                </>
              )}
              {userDetails.user_type === 'buyer' && (
                <li>
                  <button onClick={handleViewPurchaseHistory} className={`block py-2.5 px-4 rounded transition duration-200 ${showPurchaseHistory ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                    View Purchase History
                  </button>
                </li>
              )}
              <li>
                <button onClick={handleUpdateUserInfo} className={`block py-2.5 px-4 rounded transition duration-200 ${showUpdateUser ? 'bg-gradient-to-r from-pink-500 to-yellow-500' : 'hover:bg-gray-700'}`}>
                  Edit Profile
                </button>
              </li>
              <li>
                <button onClick={firebaseSignOut} className="block py-2.5 px-4 rounded hover:bg-gray-700 transition duration-200">
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 p-10">
          <div className={`transition-opacity duration-500 ${showProfile ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {showProfile && (
              <main className="bg-white text-black shadow p-4 rounded-lg mb-6">
                <h1 className="text-4xl font-bold mb-4">Hello, {userDetails.first_name} 🙏
                  <button onClick={handleUpdateUserInfo} className="absolute right-4 top-4">
                    <AiOutlineEdit size={24} />
                  </button>
                </h1>
                <h2 className="text-3xl font-semibold border-b pb-2 mb-4">User Information</h2>
                <p className="text-xl"><strong>Email:</strong> {userDetails.email}</p>
                {userDetails.user_type === 'seller' && sellerInfo && (
                  <>
                    <p className="text-xl"><strong>Phone Number:</strong> {sellerInfo.phone_num}</p>
                    <p className="text-xl mt-4"><strong>Business Name:</strong> {sellerInfo.business_name}</p>
                    <p className="text-xl"><strong>Business Address:</strong> {sellerInfo.business_address}</p>
                  </>
                )}
                {userDetails.user_type === 'buyer' && buyerInfo && (
                  <>
                    <p className="text-xl"><strong>Address:</strong> {buyerInfo.address}</p>
                    <p className="text-xl"><strong>Phone Number:</strong> {buyerInfo.phone_num}</p>
                  </>
                )}
                <div className="mt-8">
                  {userDetails.user_type === 'seller' && (
                    <>
                      <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-semibold">Business Stats (Coming Soon)</h3>
                      </div>
                      <div className="bg-gray-200 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold">Product Reviews (Coming Soon)</h3>
                      </div>
                    </>
                  )}
                </div>
              </main>
            )}
          </div>

          <div className={`transition-opacity duration-500 ${showListedItems ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {showListedItems && userDetails.user_type === 'seller' && (
              <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
                <SellerViewItem userId={user.uid} />
              </aside>
            )}
          </div>

          <div className={`transition-opacity duration-500 ${showAddProduct ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {showAddProduct && userDetails.user_type === 'seller' && (
              <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
                <ListProduct userId={user.uid} />
              </aside>
            )}
          </div>

          <div className={`transition-opacity duration-500 ${showUpdateUser ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {showUpdateUser && (
              <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
                <UpdateUserInfo userDetails={userDetails} setShowUpdateUser={setShowUpdateUser} />
              </aside>
            )}
          </div>

          <div className={`transition-opacity duration-500 ${showPurchaseHistory ? 'opacity-100' : 'opacity-0 hidden'}`}>
            {showPurchaseHistory && userDetails.user_type === 'buyer' && (
              <aside className="bg-white text-black shadow p-4 rounded-lg ml-4" style={{ flexGrow: 1 }}>
                <PurchaseHistory userId={user.uid} onClose={() => setShowPurchaseHistory(false)} />
              </aside>
            )}
          </div>
      </div>
    )
  );
}

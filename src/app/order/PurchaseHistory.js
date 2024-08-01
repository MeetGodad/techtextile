"use client";
import { useState, useEffect } from 'react';
import { useUserAuth } from '../auth/auth-context';
import { useRouter } from 'next/navigation';
import  calculateShippingCost  from './calculateShipping'
import Swal from 'sweetalert2';
import Loder from '../components/Loder';

const PurchaseHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { user } = useUserAuth();
  const router = useRouter();

  // Function to fetch order history from the API
  const fetchOrderHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/history/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch order history when the component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetchOrderHistory();
    }
  }, [userId]);

  // Handler to open the cancellation modal for an entire order
  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setSelectedItemId(null);
    setShowCancellationModal(true);
  };

  // Handler to open the cancellation modal for a specific item in an order
  const handleCancelItem = (orderId, itemId) => {
    setSelectedOrderId(orderId);
    setSelectedItemId(itemId);
    setShowCancellationModal(true);
  };

  // Function to recalculate the shipping cost for an order after an item cancellation
  const recalculateShippingCost = async (updatedOrder) => {
    try {
      const remainingItems = updatedOrder.order_items.filter(item => item.item_status !== 'canceled');


     
      if (remainingItems.length === 0) {
        // If no items left, set shipping cost to 0
        await updateOrderShippingCost(updatedOrder.order_id, 0);
        return { ...updatedOrder, order_shipping_cost: 0 };
      } else {
        // Recalculate shipping cost
        const shippingAddress = updatedOrder.shipping_address;
        console.log('remainingItems', remainingItems, 'shippingAddress', shippingAddress);

        const { totalCost: newShippingCost } = await calculateShippingCost(shippingAddress, remainingItems);

        console.log('newShippingCost', newShippingCost);
        await updateOrderShippingCost(updatedOrder.order_id, newShippingCost);
      }
    } catch (error) {
      console.error('Error recalculating shipping cost:', error.message);
      return updatedOrder;
    }
  };

  // Handler to submit the cancellation request
  const submitCancellation = async () => {
    if (!cancellationReason.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Please provide a reason for cancellation.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    setIsLoading(true);
    try {
      const endpoint = selectedItemId ? '/api/order/cancel-item' : '/api/order/cancel';
      const body = selectedItemId
        ? { orderId: selectedOrderId, orderItemId: selectedItemId, userId, cancellationReason }
        : { orderId: selectedOrderId, userId, cancellationReason };
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
  
      if (data.success) {
        // Update the orders state
        const updatedOrders = orders.map(order => {
          if (order.order_id === selectedOrderId) {
            let updatedOrder = { ...order };
            if (selectedItemId) {
              updatedOrder.order_items = updatedOrder.order_items.map(item => 
                item.order_item_id === selectedItemId 
                  ? { ...item, item_status: 'canceled', cancellation_reason: cancellationReason }
                  : item
              );
            } else {
              updatedOrder.order_status = 'canceled';
              updatedOrder.order_cancellation_reason = cancellationReason;
            }
            return updatedOrder;
          }
          return order;
        });
  
        // If an item was cancelled, recalculate shipping cost
        if (selectedItemId) {
          const updatedOrder = updatedOrders.find(o => o.order_id === selectedOrderId);
          if (updatedOrder) {
            const recalculatedOrder = await recalculateShippingCost(updatedOrder);
            const finalUpdatedOrders = updatedOrders.map(o => 
              o.order_id === selectedOrderId ? recalculatedOrder : o
            );
            setOrders(finalUpdatedOrders);
          } else {
            setOrders(updatedOrders);
          }
        } else {
          setOrders(updatedOrders);
        }
  
        // Re-fetch the order history to ensure the state is up-to-date
        await fetchOrderHistory();
  
        Swal.fire({
          title: 'Success',
          text: selectedItemId ? 'Item cancelled successfully' : 'Order cancelled successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setShowCancellationModal(false);
        setCancellationReason('');
      } else {
        throw new Error(data.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error('Error cancelling:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to cancel: ' + error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update the shipping cost of an order in the database
  const updateOrderShippingCost = async (orderId, newShippingCost) => {
    try {
      const response = await fetch('/api/order/update-shipping-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newShippingCost }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update shipping cost');
      }
    } catch (error) {
      console.error('Error updating shipping cost:', error);
      throw error;
    }
  };

  // Handler to navigate to the product detail page for repurchasing
  const handleBuyAgain = (productId) => {
    router.push(`/Productdetail?productId=${productId}`);
  };

  // Helper function to format dates for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(amount);
  };



  if(!user) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-8 text-center text-gray-500">
        Please log in to view your purchase history
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Purchase History</h2>
      {isLoading ? (
      <div className="flex justfy-center align-self ">
        <Loder />
      </div>
    ) : orders.length === 0 ? (
      <div className="text-center text-gray-500">No purchase history found</div>
    ) : (
      <div className="space-y-8">
        { orders && orders.length > 0 && orders.map((order) => (
          <div key={order.order_id} className="bg-white rounded-lg shadow-md p-6 transition transform hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order #{order.order_id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.order_status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                order.order_status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                order.order_status === 'shipped' ? 'bg-purple-200 text-purple-800' :
                order.order_status === 'delivered' ? 'bg-green-200 text-green-800' :
                'bg-red-200 text-red-800'
              }`}>
                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <p><span className="font-medium">Order Date:</span> {formatDate(order.created_at)}</p>
              <p><span className="font-medium">Payment Status:</span> {order.payment_status || 'N/A'}</p>
              <p><span className="font-medium">Original Total Price:</span> {formatCurrency(order.original_total_price)}</p>
              <p><span className="font-medium">Original Shipping Cost:</span> {formatCurrency(order.original_shipping_cost)}</p>
              
              {/* Display current prices only if they differ from original prices */}
              {(order.current_total_price !== order.original_total_price ||
                order.current_shipping_cost !== order.original_shipping_cost) && (
                <>
                  <p><span className="font-medium">Current Total Price:</span> {formatCurrency(order.current_total_price)}</p>
                  <p><span className="font-medium">Current Shipping Cost:</span> {formatCurrency(order.current_shipping_cost)}</p>
                </>
              )}
            </div>
        
            {order.order_cancellation_reason && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                <p className="font-medium">Cancellation Reason:</p>
                <p>{order.order_cancellation_reason}</p>
              </div>
            )}

            <h4 className="text-lg font-semibold mb-2">Ordered Items:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {order.order_items.map((item) => (
                <div key={item.order_item_id} className={`border rounded-lg p-4 flex flex-col relative ${item.item_status === 'canceled' ? 'border-red-500 border-2' : ''}`}>
                  <div className="relative mb-2">
                    {item.image_url && 
                      <img src={item.image_url.split(',')[0]} alt={item.product_name} className="w-full h-32 object-cover rounded-lg mb-2" />
                    }
                    {item.item_status === 'canceled' && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center rounded-lg">
                        <span className="text-white font-bold text-sm">Item Cancelled</span>
                      </div>
                    )}
                  </div>
                  <h5 className="font-semibold text-sm mb-1">{item.product_name}</h5>
                  <p className="text-sm mb-1">Price: ${item.price}</p>
                  <p className="text-sm mb-2">Quantity: {item.quantity}</p>
                  {item.selected_variant && (
                    <div className="mb-4">
                      <div className="text-gray-600 mb-2">
                        {item.selected_variant.color && (
                          <div className="flex items-center">
                            <span className="font-semibold">Color: </span>
                            <span 
                              className="inline-block w-6 h-6 rounded-full ml-2 border-2 border-black transform transition duration-300 ease-in-out hover:scale-110 hover:border-white"
                              style={{ backgroundColor: item.selected_variant.color.split(':')[1]?.trim() || item.selected_variant.color }}
                            ></span>
                          </div>
                        )}
                        {item.selected_variant.denier && (
                          <div>
                            <span className="font-semibold">Denier: </span>
                            <span>{item.selected_variant.denier.split(':')[1]?.trim() || item.selected_variant.denier}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => handleBuyAgain(item.product_id)}
                    className="mt-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 text-sm"
                  >
                    Buy Again
                  </button>
                  {item.item_status === 'canceled' ? (
                    <p className="text-sm mb-1 text-red-600">Cancellation Reason: {item.cancellation_reason}</p>
                  ) : (
                    <>
                      {order.can_cancel && (
                        <button 
                          onClick={() => handleCancelItem(order.order_id, item.order_item_id)}
                          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 text-sm"
                        >
                          Cancel Item
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            {order.can_cancel && (
              <button 
                onClick={() => handleCancelOrder(order.order_id)}
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    )}

      {showCancellationModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">
            {selectedItemId ? 'Item Cancellation Reason' : 'Order Cancellation Reason'}
          </h3>
          <textarea
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="w-full h-32 p-2 border rounded mb-4"
            placeholder="Please provide a reason for cancellation"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowCancellationModal(false);
                setSelectedOrderId(null);
                setSelectedItemId(null);
                setCancellationReason('');
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={submitCancellation}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default PurchaseHistory;



"use client";
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BusinessStats = ({ userId, onShowPurchasedItems }) => {
  const [stats, setStats] = useState({
    salesByProduct: [],
    salesByCategory: [],
    monthlySales: [],
    totalOrders: 0,
    orderStatus: [],
    averageOrderValue: 0,
    repeatOrders: [],
    topSellingProducts: [],
    productStockLevels: [],
    lowStockAlerts: [],
  });

  const [showMoreStockLevels, setShowMoreStockLevels] = useState(false);
  const [showMoreRepeatOrders, setShowMoreRepeatOrders] = useState(false);
  const [showMoreTopSelling, setShowMoreTopSelling] = useState(false);
  const [showMoreLowStock, setShowMoreLowStock] = useState(false);
  const [timeView, setTimeView] = useState('date');
  const [selectedMonth, setSelectedMonth] = useState('2024-07');
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    fetch(`/api/sales/${userId}`)
      .then(response => response.json())
      .then(data => {
        setStats({
          ...data,
          averageOrderValue: parseFloat(data.averageOrderValue || 0),
        });
      })
      .catch(error => console.error('Error fetching business stats:', error));

    fetch('/api/sales/trends')
      .then(response => response.json())
      .then(data => {
        setStats(prevStats => ({
          ...prevStats,
          monthlySales: data.monthlySales || [],
        }));
      })
      .catch(error => console.error('Error fetching sales trends:', error));
  }, [userId]);

  const handleTimeViewChange = (event) => {
    setTimeView(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const filteredMonthlySales = stats.monthlySales.filter(item => {
    if (!item.date) return false;
    if (timeView === 'date') {
      return item.date.startsWith(selectedMonth);
    }
    if (timeView === 'month') {
      return item.date.startsWith(selectedYear);
    }
    return true; // For 'year' view, include all data
  });

  const productData = {
    labels: stats.salesByProduct.map(item => item.product_name),
    datasets: [
      {
        label: 'Total Sales ($)',
        data: stats.salesByProduct.map(item => item.total_sales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 60,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const categoryData = {
    labels: stats.salesByCategory.map(item => item.product_type),
    datasets: [
      {
        label: 'Total Sales ($)',
        data: stats.salesByCategory.map(item => item.total_sales),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barThickness: 60,
        hoverBackgroundColor: 'rgba(153, 102, 255, 0.8)',
        hoverBorderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const monthlySalesData = {
    labels: filteredMonthlySales.map(item => item.date.split('T')[0]),
    datasets: [
      {
        label: 'Yarn Sales ($)',
        data: filteredMonthlySales.map(item => item.yarn_sales),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Fabric Sales ($)',
        data: filteredMonthlySales.map(item => item.fabric_sales),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: false,
        },
        title: {
          display: true,
          text: 'Product',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales ($)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Total Sales: $${context.raw}`;
          },
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: false,
        },
        title: {
          display: true,
          text: timeView === 'date' ? 'Time (Days)' : timeView === 'month' ? 'Time (Months)' : 'Time (Years)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales ($)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Total Sales: $${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Business Stats</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Monthly Sales Trends</h2>
          <div className="flex justify-between items-center mb-4">
            <select value={timeView} onChange={handleTimeViewChange} className="px-4 py-2 border rounded">
              <option value="date">View by Date</option>
              <option value="month">View by Month</option>
              <option value="year">View by Year</option>
            </select>
            {timeView === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="px-4 py-2 border rounded"
              />
            )}
            {timeView === 'year' && (
              <input
                type="number"
                value={selectedYear}
                onChange={handleYearChange}
                className="px-4 py-2 border rounded"
              />
            )}
          </div>
          <div className="relative h-96">
            {filteredMonthlySales.length > 0 ? (
              <Line data={monthlySalesData} options={lineOptions} />
            ) : (
              <p className="text-center text-gray-500">No sales data available.</p>
            )}
          </div>
        </div>
        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Sales by Product</h2>
          <div className="relative h-[90%]">
            {stats.salesByProduct.length > 0 ? (
              <Bar data={productData} options={barOptions} />
            ) : (
              <p className="text-center text-gray-500">No sales data available.</p>
            )}
          </div>
        </div>
        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Sales by Category</h2>
          <div className="relative h-96">
            {stats.salesByCategory.length > 0 ? (
              <Bar data={categoryData} options={barOptions} />
            ) : (
              <p className="text-center text-gray-500">No sales data available.</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Product Stock Levels</h2>
          {/* Changed to display 8 products, 4 on the left and 4 on the right */}
          <div className="grid grid-cols-2 gap-4">
            {stats.productStockLevels.slice(0, showMoreStockLevels ? undefined : 8).map((product, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img src={product.image_url.split(',')[0]} alt={product.product_name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-lg font-semibold">{product.product_name}</p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className={`text-sm ${product.quantity < 10 ? 'text-red-500' : 'text-green-500'}`}>
                    Quantity: {product.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {stats.productStockLevels.length > 8 && (
            <button
              onClick={() => setShowMoreStockLevels(!showMoreStockLevels)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
              {showMoreStockLevels ? 'Show Less' : 'Show More'}
            </button>
          )}
          {stats.productStockLevels.length === 0 && (
            <p className="text-center text-gray-500">No product stock levels available.</p>
          )}
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Top-Selling Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.topSellingProducts.slice(0, showMoreTopSelling ? undefined : 5).map((product, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img src={product.image_url.split(',')[0]} alt={product.product_name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-lg font-semibold">{product.product_name}</p>
                  <p className="text-gray-600">Total Sales: ${product.total_sales}</p>
                </div>
              </div>
            ))}
          </div>
          {stats.topSellingProducts.length > 5 && (
            <button
              onClick={() => setShowMoreTopSelling(!showMoreTopSelling)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
              {showMoreTopSelling ? 'Show Less' : 'Show More'}
            </button>
          )}
          {stats.topSellingProducts.length === 0 && (
            <p className="text-center text-gray-500">No top-selling products yet.</p>
          )}
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Low Stock Alerts</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.lowStockAlerts.slice(0, showMoreLowStock ? undefined : 10).map((product, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img src={product.image_url.split(',')[0]} alt={product.product_name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-lg font-semibold">{product.product_name}</p>
                  <p className="text-red-500">Only {product.quantity} left in stock!</p>
                </div>
              </div>
            ))}
          </div>
          {stats.lowStockAlerts.length > 10 && (
            <button
              onClick={() => setShowMoreLowStock(!showMoreLowStock)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
              {showMoreLowStock ? 'Show Less' : 'Show More'}
            </button>
          )}
          {stats.lowStockAlerts.length === 0 && (
            <p className="text-center text-gray-500">Your inventory is up to date!</p>
          )}
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Total Orders</h2>
          <p className="text-lg">Total Orders So Far: {stats.totalOrders > 0 ? stats.totalOrders : 'No orders placed yet.'}</p>
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Order Status Breakdown</h2>
          {stats.orderStatus.length > 0 ? (
            <>
              {stats.orderStatus.map((status, index) => (
                <p key={index} className="text-lg">
                  {status.order_status}: {status.count}
                </p>
              ))}
              <button
                onClick={onShowPurchasedItems}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              >
                Go to Purchased Items
              </button>
            </>
          ) : (
            <p className="text-center text-gray-500">No order status data available.</p>
          )}
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Average Order Value</h2>
          <p className="text-lg">Average Value Per Order: ${stats.averageOrderValue.toFixed(2)}</p>
        </div>

        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Repeat Orders</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.repeatOrders.slice(0, showMoreRepeatOrders ? undefined : 10).map((order, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img src={order.image_url.split(',')[0]} alt={order.product_name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="text-lg font-semibold">{order.product_name}</p>
                  <p className="text-gray-600">Orders: {order.order_count}</p>
                </div>
              </div>
            ))}
          </div>
          {stats.repeatOrders.length > 10 && (
            <button
              onClick={() => setShowMoreRepeatOrders(!showMoreRepeatOrders)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
              {showMoreRepeatOrders ? 'Show Less' : 'Show More'}
            </button>
          )}
          {stats.repeatOrders.length === 0 && (
            <p className="text-center text-gray-500">No repeat orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessStats;

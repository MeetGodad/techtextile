"use client";
import { useEffect, useState, useRef } from 'react';
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

  const [showMoreRepeatOrders, setShowMoreRepeatOrders] = useState(false);
  const [showMoreTopSelling, setShowMoreTopSelling] = useState(false);
  const [timeView, setTimeView] = useState('date');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const productScrollRef = useRef(null);
  const stockScrollRef = useRef(null);
  const lowStockScrollRef = useRef(null);

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

  const truncateProductName = (name) => {
    return name.length > 15 ? name.slice(0, 15) + '...' : name;
  };

  const parseVariantAttributes = (attributes) => {
    const attributesObj = attributes
      .split(',')
      .reduce((acc, attr) => {
        const [key, value] = attr.split(':').map((item) => item.trim());
        acc[key] = value;
        return acc;
      }, {});
    return attributesObj['Color'];
  };

  const handleTimeViewChange = (event) => {
    setTimeView(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
      return item.date.startsWith(selectedDate);
    }
    if (timeView === 'month') {
      return item.date.startsWith(selectedMonth);
    }
    if (timeView === 'year') {
      return item.date.startsWith(selectedYear);
    }
    return true;
  });

  const productData = {
    labels: stats.salesByProduct.map(item => truncateProductName(item.product_name)),
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
        backgroundColor: timeView === 'date' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: timeView !== 'date',
        tension: 0.4,
        barThickness: timeView === 'date' ? 60 : undefined,
      },
      {
        label: 'Fabric Sales ($)',
        data: filteredMonthlySales.map(item => item.fabric_sales),
        backgroundColor: timeView === 'date' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: timeView !== 'date',
        tension: 0.4,
        barThickness: timeView === 'date' ? 60 : undefined,
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
          maxRotation: 0,
          minRotation: 0,
        },
        title: {
          display: true,
          text: 'Product',
        },
        barPercentage: timeView === 'date' ? 0.5 : undefined,
        categoryPercentage: timeView === 'date' ? 0.5 : undefined,
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
          text: timeView === 'date' ? 'Time (Days)' : timeView === 'month' ? 'Time (Days)' : 'Time (Years)',
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
    <div className="p-4 bg-gray-100 min-h-screen" style={{ zoom: '100%' }}>
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
            {timeView === 'date' && (
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-4 py-2 border rounded"
              />
            )}
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
              timeView === 'date' ? (
                <Bar data={monthlySalesData} options={barOptions} />
              ) : (
                <Line data={monthlySalesData} options={lineOptions} />
              )
            ) : (
              <p className="text-center text-gray-500">No sales data available.</p>
            )}
          </div>
        </div>
        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Sales by Product</h2>
          <div className="relative h-96">
            <div className="overflow-x-auto h-full" ref={productScrollRef}>
              {stats.salesByProduct.length > 0 ? (
                <div className="h-full min-w-[300px]">
                  <Bar data={productData} options={barOptions} />
                </div>
              ) : (
                <p className="text-center text-gray-500">No sales data available.</p>
              )}
            </div>
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
          <div className="overflow-y-auto h-96" ref={stockScrollRef}>
            <div className="">
              {stats.productStockLevels.map((product, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border-b border-gray-300 w-full">
                  <img src={product.image_url.split(',')[0]} alt={product.product_name} className="w-20 h-20 object-contain rounded" />
                  <div className="flex flex-col space-y-2 w-full">
                    <p className="text-lg font-semibold">{truncateProductName(product.product_name)}</p>
                    <p className="text-gray-600">Price: ${product.price}</p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {product.variants.map((variant, idx) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: parseVariantAttributes(variant.variant_attributes) }}></div>
                          <p className={`text-sm ${variant.quantity < 10 ? 'text-red-500' : 'text-green-500'}`}>
                            {variant.quantity} {variant.quantity === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {stats.productStockLevels.length === 0 && (
            <p className="text-center text-gray-500">No product stock levels available.</p>
          )}
        </div>





        <div className="p-4 bg-white text-black shadow-md rounded-lg border border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Low Stock Alerts</h2>
          <div className="overflow-y-auto h-96" ref={lowStockScrollRef}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 h-full">
              {stats.lowStockAlerts.map((product, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border-b border-gray-300">
                  <img src={product.image_url.split(',')[0]} alt={product.product_name} className="w-16 h-16 object-contain rounded" />
                  <div className="flex flex-col space-y-2">
                    <p className="text-lg font-semibold">{truncateProductName(product.product_name)}</p>
                    <p className="text-red-500">Only {product.quantity} left in stock!</p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((variant, idx) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: parseVariantAttributes(variant.variant_attributes) }}></div>
                          <p className="text-sm">Qty: {variant.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                className="mt-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-gray-600 transition duration-300">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.repeatOrders.slice(0, showMoreRepeatOrders ? undefined : 10).map((order, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img src={order.image_url.split(',')[0]} alt={order.product_name} className="w-16 h-16 object-contain rounded" />
                <div className="flex flex-col space-y-2">
                  <p className="text-lg font-semibold">{truncateProductName(order.product_name)}</p>
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

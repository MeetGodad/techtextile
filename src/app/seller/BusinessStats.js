import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BusinessStats = ({ userId }) => {
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  useEffect(() => {
    fetch(`/api/sales/${userId}`)
      .then(response => response.json())
      .then(data => {
        setSalesByProduct(data.salesByProduct || []);
        setSalesByCategory(data.salesByCategory || []);
      })
      .catch(error => console.error('Error fetching business stats:', error));
  }, [userId]);

  const truncateProductName = (name) => {
    return name.length > 12 ? name.slice(0, 12) + '...' : name;
  };

  const productData = {
    labels: salesByProduct.map(item => truncateProductName(item.product_name)),
    datasets: [
      {
        label: 'Total Sales',
        data: salesByProduct.map(item => item.total_sales),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 50,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const categoryData = {
    labels: salesByCategory.map(item => item.product_type),
    datasets: [
      {
        label: 'Total Sales',
        data: salesByCategory.map(item => item.total_sales),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        barThickness: 60,
        hoverBackgroundColor: 'rgba(153, 102, 255, 0.8)',
        hoverBorderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: false,
          callback: function (val, index) {
            return this.getLabelForValue(val).split(' ').map((word, i, arr) => {
              if (arr.length > 1 && i < arr.length - 1) return word + ' ';
              return word;
            });
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
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
    <div className="flex flex-col lg:flex-row lg:justify-between p-4 space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="w-full lg:w-1/2 p-4 bg-gray-100 text-black shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Sales by Product</h2>
        <div className="relative h-96">
          <Bar data={productData} options={options} />
        </div>
      </div>
      <div className="w-full lg:w-1/2 p-4 bg-gray-100 text-black shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Sales by Category</h2>
        <div className="relative h-96">
          <Bar data={categoryData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BusinessStats;

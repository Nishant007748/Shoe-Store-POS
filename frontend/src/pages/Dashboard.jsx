import { useState, useEffect } from 'react';
import { saleAPI, shoeAPI } from '../utils/api';
import { FaMoneyBillWave, FaShoppingCart, FaExclamationTriangle, FaTrophy } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await saleAPI.getStats();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const chartData = {
    labels: stats?.dailySales?.map(d => new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [{
      label: 'Daily Revenue',
      data: stats?.dailySales?.map(d => d.total) || [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats?.today?.revenue?.toLocaleString() || 0}</p>
              <p className="text-sm text-green-600 mt-1">{stats?.today?.sales || 0} sales</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaMoneyBillWave className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats?.month?.revenue?.toLocaleString() || 0}</p>
              <p className="text-sm text-blue-600 mt-1">{stats?.month?.sales || 0} sales</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaShoppingCart className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.lowStockCount || 0}</p>
              <p className="text-sm text-orange-600 mt-1">Need attention</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="text-white text-2xl" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Seller</p>
              <p className="text-lg font-bold text-gray-900 mt-2 truncate">{stats?.topSelling?.[0]?.shoeName || 'N/A'}</p>
              <p className="text-sm text-purple-600 mt-1">{stats?.topSelling?.[0]?.totalQuantity || 0} sold</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FaTrophy className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Shoes</h3>
          <div className="space-y-3">
            {stats?.topSelling?.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.shoeName}</p>
                  <p className="text-sm text-gray-500">{item.totalQuantity} units sold</p>
                </div>
                <p className="text-lg font-bold text-blue-600">₹{item.totalRevenue?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

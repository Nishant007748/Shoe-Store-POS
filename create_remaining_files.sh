#!/bin/bash

# Create all remaining frontend files

# Layout Component
mkdir -p frontend/src/components/common
cat > frontend/src/components/common/Layout.jsx << 'EOFLAYOUT'
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaBox, FaCashRegister, FaUsers, FaChartLine, FaStar, FaSignOutAlt, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FaHome, roles: ['user', 'owner'] },
    { name: 'POS / Sales', to: '/pos', icon: FaCashRegister, roles: ['user', 'owner'] },
    { name: 'Inventory', to: '/inventory', icon: FaBox, roles: ['user', 'owner'] },
    { name: 'Customers', to: '/customers', icon: FaUsers, roles: ['user', 'owner'] },
    { name: 'New Arrivals', to: '/new-arrivals', icon: FaStar, roles: ['owner'] },
    { name: 'Reports', to: '/reports', icon: FaChartLine, roles: ['owner'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen flex">
      <aside className={`\${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaShoppingBag className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Shoe POS</h1>
                  <p className="text-xs text-gray-500">{user?.role === 'owner' ? 'Owner' : 'Staff'}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><FaTimes /></button>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `sidebar-link \${isActive ? 'sidebar-link-active' : ''}`}>
                <item.icon className="text-lg" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full btn-secondary flex items-center justify-center gap-2 py-2">
              <FaSignOutAlt /><span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><FaBars className="text-2xl text-gray-600" /></button>
            <h2 className="text-xl font-semibold text-gray-900">Welcome, {user?.name}!</h2>
            <div className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8"><Outlet /></main>
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;
EOFLAYOUT

# Dashboard Page
mkdir -p frontend/src/pages
cat > frontend/src/pages/Dashboard.jsx << 'EOFDASH'
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
EOFDASH

echo "Created Layout and Dashboard components"

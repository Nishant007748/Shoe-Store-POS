import { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import { FaChartBar, FaChartLine, FaUsers, FaBoxOpen, FaExclamationTriangle, FaCalendarAlt, FaMoneyBillWave, FaTrophy, FaShoppingCart } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const fetchReports = async () => {
    try {
      const [sales, inventory] = await Promise.all([
        reportAPI.getSalesReport({ startDate, endDate }),
        reportAPI.getInventoryReport()
      ]);
      setSalesReport(sales.data.data);
      setInventoryReport(inventory.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard & Reports</h1>

        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <FaCalendarAlt className="text-gray-400 ml-2" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
          />
          <span className="text-gray-300">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Period Revenue */}
        <div className="stat-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Period Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{salesReport?.summary?.totalRevenue?.toLocaleString() || 0}</p>
              <p className="text-sm text-blue-600 mt-1">{salesReport?.summary?.totalSales || 0} sales</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaMoneyBillWave className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Top Seller in Period */}
        <div className="stat-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Seller</p>
              <p className="text-lg font-bold text-gray-900 mt-2 truncate">{salesReport?.topItems?.[0]?._id || 'N/A'}</p>
              <p className="text-sm text-purple-600 mt-1">{salesReport?.topItems?.[0]?.quantity || 0} sold</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FaTrophy className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="stat-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{salesReport?.summary?.averageSale?.toFixed(0) || 0}</p>
              <p className="text-sm text-green-600 mt-1">Per transaction</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="stat-card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{inventoryReport?.lowStock?.length || 0}</p>
              <p className="text-sm text-orange-600 mt-1">Need attention</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Trend Chart (Left) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Sales Trend</h3>
          <div className="flex-1">
            <Line 
              data={{
                labels: salesReport?.salesByPeriod?.map(d => {
                  // Format as requested based on the period format
                  const dateParts = d._id.split('-');
                  if (dateParts.length === 3) {
                    return new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }
                  return d._id;
                }) || [],
                datasets: [{
                  label: 'Revenue',
                  data: salesReport?.salesByPeriod?.map(d => d.totalRevenue) || [],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                }]
              }} 
              options={{ responsive: true, maintainAspectRatio: true }} 
            />
          </div>
        </div>

        {/* Top Selling Items (Right) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <FaChartBar className="text-blue-500 text-xl" />
            <h3 className="text-xl font-bold text-gray-800">Top Selling Products</h3>
          </div>

          <div className="space-y-4 flex-1">
            {salesReport?.topItems && salesReport.topItems.length > 0 ? (
              salesReport.topItems.map((item, idx) => (
                <div key={idx} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item._id || 'Unknown Shoe'}</p>
                    <p className="text-sm text-gray-500">{item.quantity} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{item.revenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <FaChartBar className="text-4xl mb-3 opacity-20" />
                <p>No sales data for this period</p>
              </div>
            )}
          </div>
        </div>

        </div>

        {/* Third Row: Inventory & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:col-span-2">
          {/* Inventory By Brand */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Inventory by Brand</h3>
            <div className="space-y-4">
              {inventoryReport?.byBrand?.map((brand, idx) => (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-gray-700">{brand.brandName || 'Unknown'}</span>
                    <span className="text-sm font-semibold text-gray-500">₹{brand.value?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`bg-blue-500 h-2 rounded-full`}
                      style={{ width: `\${Math.min(100, (brand.quantity / (inventoryReport?.summary?.totalItems || 100)) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{brand.items} models • {brand.quantity} units in stock</p>
                </div>
              ))}
              {(!inventoryReport?.byBrand || inventoryReport.byBrand.length === 0) && (
                <p className="text-gray-400 text-center py-4">No inventory data available</p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6 w-full">
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <h3 className="text-xl font-bold text-red-800">Low Stock Alerts</h3>
            </div>
            <div className="space-y-3">
              {inventoryReport?.lowStock && inventoryReport.lowStock.length > 0 ? (
                inventoryReport.lowStock.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border border-red-100">
                    <span className="font-medium text-gray-800">{item.name} <span className="text-xs text-gray-400">({item.sku})</span></span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold rounded">Only {item.quantity} left</span>
                  </div>
                ))
              ) : (
                <p className="text-red-600 text-sm font-medium">No low stock items detected currently.</p>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Reports;

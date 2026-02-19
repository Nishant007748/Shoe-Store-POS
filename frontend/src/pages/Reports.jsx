import { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import { FaFileDownload, FaChartBar } from 'react-icons/fa';

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
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gray-900">Reports & Analytics</h1>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{salesReport?.summary?.totalSales || 0}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{salesReport?.summary?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-gray-600">Average Sale</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{salesReport?.summary?.averageSale?.toFixed(0) || 0}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-gray-600">Total Discount</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">₹{salesReport?.summary?.totalDiscount?.toLocaleString() || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
            <div className="space-y-3">
              {salesReport?.topItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item._id}</p>
                    <p className="text-sm text-gray-600">{item.quantity} units sold</p>
                  </div>
                  <p className="font-bold text-green-600">₹{item.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Brand</h3>
            <div className="space-y-3">
              {inventoryReport?.byBrand?.map((brand, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{brand.brandName}</p>
                    <p className="text-sm text-gray-600">{brand.items} items | {brand.quantity} units</p>
                  </div>
                  <p className="font-bold text-blue-600">₹{brand.value?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

import { useState, useEffect } from 'react';
import { shoeAPI, brandAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox } from 'react-icons/fa';

const Inventory = () => {
  const [shoes, setShoes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedBrand, search]);

  const fetchData = async () => {
    try {
      const [shoesRes, brandsRes] = await Promise.all([
        shoeAPI.getAll({ brand: selectedBrand, search }),
        brandAPI.getAll()
      ]);
      setShoes(shoesRes.data.data);
      setBrands(brandsRes.data.data);
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
        <h1 className="text-3xl font-display font-bold text-gray-900">Inventory Management</h1>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search shoes..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10" />
          </div>
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="input-field md:w-64">
            <option value="">All Brands</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shoes.map(shoe => (
                <tr key={shoe._id} className="table-row">
                  <td className="px-6 py-4 text-sm text-gray-900">{shoe.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{shoe.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{shoe.brand?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{shoe.size}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{shoe.color}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{shoe.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{shoe.sellingPrice}</td>
                  <td className="px-6 py-4">
                    {shoe.isLowStock ? <span className="badge badge-warning">Low Stock</span> : 
                    shoe.quantity === 0 ? <span className="badge badge-danger">Out of Stock</span> :
                    <span className="badge badge-success">In Stock</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

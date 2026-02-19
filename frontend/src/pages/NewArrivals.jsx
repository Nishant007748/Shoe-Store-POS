import { useState, useEffect } from 'react';
import { shoeAPI } from '../utils/api';
import { FaStar, FaClock } from 'react-icons/fa';

const NewArrivals = () => {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArrivals();
  }, []);

  const fetchArrivals = async () => {
    try {
      const { data } = await shoeAPI.getArrivals();
      setArrivals(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (id) => {
    if (!confirm('Convert this arrival to active inventory?')) return;
    try {
      await shoeAPI.convertArrival(id);
      alert('Successfully converted to inventory!');
      fetchArrivals();
    } catch (error) {
      alert('Error converting arrival');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gray-900">New Arrivals</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arrivals.map(arrival => (
          <div key={arrival._id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span className={`badge \${arrival.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                  {arrival.status}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{arrival.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{arrival.brand?.name} | {arrival.shoeType?.name}</p>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Size</p>
                <p className="font-semibold">{arrival.size}</p>
              </div>
              <div>
                <p className="text-gray-500">Color</p>
                <p className="font-semibold">{arrival.color}</p>
              </div>
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-semibold">{arrival.expectedQuantity}</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-semibold text-green-600">₹{arrival.sellingPrice}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <FaClock />
              <span>Expected: {new Date(arrival.expectedDate).toLocaleDateString()}</span>
            </div>

            {arrival.status === 'pending' && !arrival.convertedToShoe && (
              <button onClick={() => handleConvert(arrival._id)} className="w-full btn-primary">
                Convert to Inventory
              </button>
            )}
          </div>
        ))}
      </div>

      {arrivals.length === 0 && (
        <div className="card p-12 text-center">
          <FaStar className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-500">No new arrivals</p>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;

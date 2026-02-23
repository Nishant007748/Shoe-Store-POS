import { useState, useEffect } from 'react';
import { shoeAPI } from '../utils/api';
import { FaStar, FaClock, FaBox, FaCheckCircle, FaSpinner } from 'react-icons/fa';

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
    if (!window.confirm('Convert this arrival to active inventory?')) return;
    try {
      await shoeAPI.convertArrival(id);
      fetchArrivals();
    } catch (error) {
      console.error('Error converting arrival:', error);
      alert('Error converting arrival. Check console for details.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">New Arrivals</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {arrivals.map(arrival => (
            <div key={arrival._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col relative">

              <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {arrival.images && arrival.images[0] ? (
                  <img src={arrival.images[0]} alt={arrival.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-gray-400 text-5xl"><FaStar /></div>
                )}

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-gray-700">
                  <FaClock className="text-blue-500" />
                  {new Date(arrival.expectedDate).toLocaleDateString()}
                </div>

                <div className="absolute top-3 right-3">
                  {arrival.status === 'pending' ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                      <FaSpinner className="animate-spin" /> Pending
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                      <FaCheckCircle /> Arrived
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{arrival.name}</h3>
                  <p className="text-gray-500 text-sm font-medium">{arrival.brand?.name} • {arrival.shoeType?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Size</span>
                    <span className="font-medium text-gray-900">{arrival.size}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Color</span>
                    <span className="font-medium text-gray-900">{arrival.color}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Expected Qty</span>
                    <span className="font-bold text-blue-600">{arrival.expectedQuantity}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">Selling Price</span>
                    <span className="font-bold text-green-600">₹{arrival.sellingPrice}</span>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  {arrival.status === 'pending' && !arrival.convertedToShoe ? (
                    <button
                      onClick={() => handleConvert(arrival._id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <FaBox /> Convert to Inventory
                    </button>
                  ) : arrival.convertedToShoe ? (
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 text-sm font-bold rounded-lg border border-green-100">
                      <FaCheckCircle /> Added to Inventory
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {arrivals.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-300 text-6xl flex justify-center mb-4"><FaStar /></div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No new arrivals</h3>
            <p className="text-gray-500">Check back later for upcoming inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;

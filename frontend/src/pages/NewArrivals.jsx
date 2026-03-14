import { useState, useEffect } from 'react';
import { shoeAPI, brandAPI } from '../utils/api';
import { FaStar, FaClock, FaBox, FaCheckCircle, FaSpinner, FaPlus } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const ArrivalFormModal = ({ isOpen, onClose, onSubmit, brands, shoeTypes }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { reset(); }, [isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    const fd = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] === undefined || data[key] === null) return;
      if (key === 'images') {
        const imgVal = data.images;
        if (imgVal && typeof imgVal === 'string' && imgVal.trim() !== '') {
          fd.append('imageUrls', imgVal); // Map string -> secure field
        }
      } else {
        fd.append(key, data[key]);
      }
    });

    if (!data.shoeType && shoeTypes.length > 0) fd.append('shoeType', shoeTypes[0]._id);
    fd.append('status', 'pending');
    onSubmit(fd);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mt-10 mb-10">
        <h2 className="text-2xl font-bold mb-4">Add New Arrival</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input {...register('name', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <select {...register('brand', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shoe Type</label>
              <select {...register('shoeType', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                <option value="">Select Type</option>
                {shoeTypes.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select {...register('size', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                {['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input {...register('color', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <select {...register('material', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none">
                {['Leather', 'Synthetic', 'Canvas', 'Rubber', 'Mesh', 'Suede', 'Textile'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Qty</label>
              <input type="number" {...register('expectedQuantity', { required: true, min: 0 })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Date</label>
              <input type="date" {...register('expectedDate', { required: true })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
              <input type="number" {...register('mrp', { required: true, min: 0 })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (₹)</label>
              <input type="number" {...register('sellingPrice', { required: true, min: 0 })} className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input {...register('images')} placeholder="https://..." className="input-field mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 font-bold rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-bold rounded-lg shadow-md transition-all">Create Arrival</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NewArrivals = () => {
  const [arrivals, setArrivals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [shoeTypes, setShoeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [arrivalsRes, brandsRes, typesRes] = await Promise.all([
        shoeAPI.getArrivals(),
        brandAPI.getAll(),
        shoeAPI.getTypes()
      ]);
      setArrivals(arrivalsRes.data.data);
      setBrands(brandsRes.data.data || []);
      setShoeTypes(typesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (id) => {
    if (!window.confirm('Convert this arrival to active inventory?')) return;
    try {
      await shoeAPI.convertArrival(id);
      fetchData();
    } catch (error) {
      console.error('Error converting arrival:', error);
      alert('Error converting arrival. Check console for details.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      await shoeAPI.createArrival(formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating arrival:', error);
      const resData = error.response?.data;
      if (resData?.errors && Array.isArray(resData.errors)) {
        alert('Validation Error: \n' + resData.errors.map(e => '- ' + e.msg).join('\n'));
      } else {
        alert(resData?.message || 'Error saving. Please check the form data.');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">New Arrivals</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <FaPlus /> Add Arrival
        </button>
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

      <ArrivalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        brands={brands}
        shoeTypes={shoeTypes}
      />
    </div>
  );
};

export default NewArrivals;

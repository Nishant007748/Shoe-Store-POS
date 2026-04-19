import { useState, useEffect } from 'react';
import { shoeAPI, brandAPI, getImageUrl } from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const ShoeFormModal = ({ isOpen, onClose, onSubmit, brands, shoeTypes, editingShoe }) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (editingShoe) {
      Object.keys(editingShoe).forEach(key => {
        let val = editingShoe[key];
        if (typeof val === 'object' && val !== null) {
          val = val._id;
        }
        if (key === 'images' && Array.isArray(val) && val.length > 0) {
          val = val[0]; // for simplicity we handle single image string in this ui 
        }
        setValue(key, val);
      });
    } else {
      reset();
    }
  }, [editingShoe, setValue, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    // Basic transform: images expects array, but our form is simple input
    const formattedData = { ...data };
    if (formattedData.images) {
      // Just wrap string in array if backend expects array.
      formattedData.images = [data.images];
    }

    // In our api setup, create uses formData if sending file, but here we can try JSON if not uploading file physically, 
    // OR we can convert to FormData. 
    // Wait, shoe API in `api.js` expects formData:
    // create: (formData) => api.post('/shoes', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

    // So we need to put it in FormData.
    const fd = new FormData();
    Object.keys(formattedData).forEach(key => {
      // Don't send undefined/null
      if (formattedData[key] === undefined || formattedData[key] === null) return;

      if (key === 'imageFile') {
        const fileList = formattedData.imageFile;
        if (fileList && fileList.length > 0) {
          fd.append('images', fileList[0]);
        }
      } else if (key !== 'images') {
        fd.append(key, formattedData[key]);
      }
    });

    // Also need to handle shoeType since it's required by backend. If not in form, use default.
    if (!formattedData.shoeType && shoeTypes.length > 0) {
      fd.append('shoeType', shoeTypes[0]._id);
    }

    onSubmit(fd, editingShoe?._id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mt-10 mb-10">
        <h2 className="text-2xl font-bold mb-4">{editingShoe ? 'Edit Shoe' : 'Add Shoe'}</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input {...register('name', { required: true })} className="input-field mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <select {...register('brand', { required: true })} className="input-field mt-1">
                <option value="">Select Brand</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shoe Type</label>
              <select {...register('shoeType', { required: true })} className="input-field mt-1">
                <option value="">Select Type</option>
                {shoeTypes.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input {...register('sku', { required: true })} className="input-field mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select {...register('size', { required: true })} className="input-field mt-1">
                {['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color</label>
              <input {...register('color', { required: true })} className="input-field mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <select {...register('material', { required: true })} className="input-field mt-1">
                {['Leather', 'Synthetic', 'Canvas', 'Rubber', 'Mesh', 'Suede', 'Textile'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" {...register('quantity', { required: true, min: 0 })} className="input-field mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
              <input type="number" {...register('mrp', { required: true, min: 0 })} className="input-field mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (₹)</label>
              <input type="number" {...register('sellingPrice', { required: true, min: 0 })} className="input-field mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Shoe Image (.jpg, .png)</label>
              {editingShoe && editingShoe.images && editingShoe.images[0] && (
                <div className="mb-2 w-16 h-16 rounded overflow-hidden border border-gray-200">
                  <img src={getImageUrl(editingShoe.images[0])} alt="Current" className="w-full h-full object-cover" />
                </div>
              )}
              <input type="file" accept="image/jpeg, image/png, image/jpg" {...register('imageFile')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea {...register('description')} className="input-field mt-1" rows="2"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingShoe ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Inventory = () => {
  const [shoes, setShoes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [shoeTypes, setShoeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShoe, setEditingShoe] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedBrand, search]);

  const fetchData = async () => {
    try {
      const [shoesRes, brandsRes, typesRes] = await Promise.all([
        shoeAPI.getAll({ brand: selectedBrand, search }),
        brandAPI.getAll(),
        shoeAPI.getTypes()
      ]);
      setShoes(shoesRes.data.data);
      setBrands(brandsRes.data.data);
      setShoeTypes(typesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShoe = async (id) => {
    if (window.confirm('Are you sure you want to delete this shoe?')) {
      try {
        await shoeAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting shoe:', error);
      }
    }
  };

  const handleOpenModal = (shoe = null) => {
    setEditingShoe(shoe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShoe(null);
  };

  const handleFormSubmit = async (formData, id) => {
    try {
      if (id) {
        await shoeAPI.update(id, formData);
      } else {
        await shoeAPI.create(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving shoe:', error);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Inventory</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <FaPlus /> Add Shoe
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shoes by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full md:w-64 py-3 px-4 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shoes.map(shoe => (
            <div key={shoe._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {shoe.images && shoe.images[0] ? (
                  <img src={getImageUrl(shoe.images[0])} alt={shoe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-gray-400 text-5xl"><FaBox /></div>
                )}
                <div className="absolute top-3 right-3">
                  {shoe.isLowStock ? <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full shadow-sm">Low Stock</span> :
                    shoe.quantity === 0 ? <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full shadow-sm">Out of Stock</span> :
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full shadow-sm">In Stock</span>}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{shoe.name}</h3>
                    <p className="text-gray-500 text-sm">{shoe.brand?.name} • {shoe.color}</p>
                  </div>
                  <span className="text-lg font-extrabold text-blue-600">₹{shoe.sellingPrice}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600 mb-6">
                  <div className="bg-gray-50 px-2 py-1 rounded">Size: <span className="font-medium text-gray-900">{shoe.size}</span></div>
                  <div className="bg-gray-50 px-2 py-1 rounded">Qty: <span className="font-medium text-gray-900">{shoe.quantity}</span></div>
                </div>

                <div className="mt-auto flex gap-2 pt-4 border-t border-gray-50">
                  <button onClick={() => handleOpenModal(shoe)} className="flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deleteShoe(shoe._id)} className="flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shoes.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-400 text-6xl mb-4 flex justify-center"><FaBox /></div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">No shoes found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <ShoeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        brands={brands}
        shoeTypes={shoeTypes}
        editingShoe={editingShoe}
      />
    </div>
  );
};

export default Inventory;

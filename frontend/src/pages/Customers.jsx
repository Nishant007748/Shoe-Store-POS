import { useState, useEffect } from 'react';
import { customerAPI } from '../utils/api';
import { FaUser, FaPhone, FaEnvelope, FaStar, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaRegStickyNote } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const CustomerFormModal = ({ isOpen, onClose, onSubmit, editingCustomer }) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (editingCustomer) {
      Object.keys(editingCustomer).forEach(key => {
        setValue(key, editingCustomer[key]);
      });
    } else {
      reset();
    }
  }, [editingCustomer, setValue, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = (data) => {
    onSubmit(data, editingCustomer?._id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mt-10 mb-10">
        <h2 className="text-2xl font-bold mb-4">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input {...register('name', { required: true })} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input {...register('phone')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" {...register('age')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select {...register('gender')} className="input-field mt-1 w-full">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Requirements / Looking For</label>
              <input {...register('requirements')} className="input-field mt-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction Status</label>
              <select {...register('transactionStatus')} className="input-field mt-1 w-full">
                <option value="Not Purchased">Not Purchased</option>
                <option value="Purchased">Purchased</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason (if not purchased)</label>
              <input {...register('reason')} className="input-field mt-1 w-full" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea {...register('notes')} className="input-field mt-1 w-full" rows="2"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary px-4 py-2">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2">{editingCustomer ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerHistoryModal = ({ isOpen, onClose, customerData }) => {
  if (!isOpen || !customerData) return null;

  const { customer, purchases } = customerData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl mt-10 mb-10">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">History: {customer.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimesCircle className="text-3xl" />
          </button>
        </div>

        {purchases && purchases.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {purchases.map(sale => (
              <div key={sale._id} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 hover:bg-white transition-colors shadow-sm">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <span className="font-bold text-gray-900 block">{new Date(sale.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs text-gray-500">Invoice: {sale.invoiceNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-blue-600 block text-lg">₹{sale.total.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{sale.paymentMethod}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {sale.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-xs">{item.quantity}x</span>
                        <div>
                          <p className="font-medium text-gray-800">{item.shoeName}</p>
                          <p className="text-xs text-gray-500">{item.size} • {item.color}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700">₹{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <FaRegStickyNote className="text-gray-300 text-5xl mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-900">No purchase history</p>
            <p className="text-sm text-gray-500">This customer hasn't bought anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};



const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const fetchCustomers = async () => {
    try {
      const { data } = await customerAPI.getAll({ search });
      setCustomers(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleOpenModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleFormSubmit = async (data, id) => {
    try {
      if (id) {
        await customerAPI.update(id, data);
      } else {
        await customerAPI.create(data);
      }
      handleCloseModal();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      const resData = error.response?.data;
      if (resData?.errors && Array.isArray(resData.errors)) {
        alert('Validation Error: \n' + resData.errors.map(e => '- ' + e.msg).join('\n'));
      } else {
        alert(resData?.message || 'Error saving. Please check the form data.');
      }
    }
  };

  const handleOpenHistory = async (id) => {
    try {
      setLoading(true);
      const { data } = await customerAPI.getById(id);
      setHistoryData(data.data);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Could not load purchase history.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Customer Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <FaPlus /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-8">
          <div className="relative w-full md:w-96">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {customers.map(customer => (
            <div key={customer._id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group flex flex-col">

              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <button onClick={() => handleOpenModal(customer)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full"><FaEdit /></button>
                <button onClick={() => deleteCustomer(customer._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full"><FaTrash /></button>
              </div>

              <div className="flex flex-col items-center mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random&color=fff&size=80`}
                  alt={customer.name}
                  className="w-20 h-20 rounded-full mb-3 shadow-md"
                />
                <h3 className="font-bold text-xl text-gray-900 text-center">{customer.name}</h3>
                <div className="flex gap-2 mt-1 flex-wrap justify-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Age: {customer.age || 'N/A'}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">{customer.gender || 'Unknown'}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                    <FaPhone />
                  </div>
                  <span className="font-medium">{customer.phone || 'No phone'}</span>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0 mt-1">
                    <FaRegStickyNote />
                  </div>
                  <div>
                    <span className="font-medium block text-gray-700">Looking for:</span>
                    <span className="text-xs">{customer.requirements || 'None specified'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                  {customer.transactionStatus === 'Purchased' ? (
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-sm font-semibold">
                      <FaCheckCircle /> Purchased
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded text-sm font-semibold" title={customer.reason}>
                      <FaTimesCircle /> Not Purchased
                    </span>
                  )}
                </div>
                {customer.transactionStatus !== 'Purchased' && customer.reason && (
                  <p className="mt-2 text-xs text-gray-500 italic">"{customer.reason}"</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenHistory(customer._id)}
                    className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors w-full text-center p-2 rounded bg-blue-50/50 hover:bg-blue-100"
                  >
                    View Purchase History
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <FaUser className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-1">No customers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or add a new customer.</p>
          </div>
        )}
      </div>

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        editingCustomer={editingCustomer}
      />

      <CustomerHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        customerData={historyData}
      />
    </div>
  );
};

export default Customers;

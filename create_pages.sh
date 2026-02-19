#!/bin/bash

# Create remaining page components

# Inventory Page
cat > frontend/src/pages/Inventory.jsx << 'EOFINV'
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
EOFINV

# POS Page
cat > frontend/src/pages/POS.jsx << 'EOFPOS'
import { useState, useEffect } from 'react';
import { shoeAPI, customerAPI, saleAPI } from '../utils/api';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const POS = () => {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length > 2) fetchShoes();
  }, [search]);

  const fetchShoes = async () => {
    try {
      const { data } = await shoeAPI.getAll({ search, limit: 10 });
      setShoes(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addToCart = (shoe) => {
    const existing = cart.find(item => item.shoe === shoe._id);
    if (existing) {
      setCart(cart.map(item => item.shoe === shoe._id ? {...item, quantity: item.quantity + 1} : item));
    } else {
      setCart([...cart, {
        shoe: shoe._id,
        shoeName: shoe.name,
        sku: shoe.sku,
        size: shoe.size,
        color: shoe.color,
        quantity: 1,
        unitPrice: shoe.sellingPrice,
        subtotal: shoe.sellingPrice
      }]);
    }
    setSearch('');
    setShoes([]);
  };

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].subtotal = newCart[index].quantity * newCart[index].unitPrice;
    }
    setCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await saleAPI.create({
        items: cart,
        subtotal,
        discount: discountAmount,
        discountPercentage: discount,
        tax,
        taxPercentage: 18,
        total,
        paymentMethod: 'Cash'
      });
      alert('Sale completed successfully!');
      setCart([]);
      setDiscount(0);
    } catch (error) {
      alert('Error processing sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Search Products</h2>
          <div className="relative">
            <input type="text" placeholder="Search by name, SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field" />
            {shoes.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
                {shoes.map(shoe => (
                  <div key={shoe._id} onClick={() => addToCart(shoe)}
                    className="p-4 hover:bg-blue-50 cursor-pointer border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{shoe.name}</p>
                        <p className="text-sm text-gray-600">{shoe.brand?.name} | {shoe.size} | {shoe.color}</p>
                      </div>
                      <p className="font-bold text-blue-600">₹{shoe.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaShoppingCart className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold">Cart ({cart.length})</h2>
        </div>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {cart.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium">{item.shoeName}</p>
                  <p className="text-sm text-gray-600">{item.size} | {item.color}</p>
                </div>
                <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-red-600">
                  <FaTrash />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(idx, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded border">
                    <FaMinus className="text-sm" />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(idx, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded border">
                    <FaPlus className="text-sm" />
                  </button>
                </div>
                <p className="font-bold">₹{item.subtotal}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6 pt-6 border-t">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Discount (%)</span>
            <input type="number" value={discount} onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-20 px-2 py-1 border rounded text-right" />
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount Amount</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Tax (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-3 border-t">
            <span>Total</span>
            <span className="text-blue-600">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={cart.length === 0 || loading}
          className="w-full btn-primary text-lg py-4">
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default POS;
EOFPOS

echo "Created Inventory and POS pages"

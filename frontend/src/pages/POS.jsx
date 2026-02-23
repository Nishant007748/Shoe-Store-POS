import { useState, useEffect } from 'react';
import { shoeAPI, saleAPI } from '../utils/api';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaSearch, FaBox } from 'react-icons/fa';

const POS = () => {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Need to fetch some shoes initially to show in the grid
  useEffect(() => {
    fetchShoes();
  }, [search]);

  const fetchShoes = async () => {
    try {
      const { data } = await shoeAPI.getAll({ search, limit: 12 }); // fetch 12 shoes
      setShoes(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addToCart = (shoe) => {
    if (shoe.quantity <= 0) {
      alert("This shoe is out of stock!");
      return;
    }

    const existing = cart.find(item => item.shoe === shoe._id);
    if (existing) {
      if (existing.quantity >= shoe.quantity) {
        alert("Cannot add more than available stock!");
        return;
      }
      setCart(cart.map(item => item.shoe === shoe._id ? {
        ...item,
        quantity: item.quantity + 1,
        subtotal: (item.quantity + 1) * item.unitPrice
      } : item));
    } else {
      setCart([...cart, {
        shoe: shoe._id,
        shoeName: shoe.name,
        sku: shoe.sku,
        size: shoe.size,
        color: shoe.color,
        quantity: 1,
        unitPrice: shoe.sellingPrice,
        subtotal: shoe.sellingPrice,
        image: shoe.images && shoe.images.length > 0 ? shoe.images[0] : null
      }]);
    }
    // Don't clear search so user can add multiple items easily
  };

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    const item = newCart[index];

    if (delta > 0) {
      // Find the shoe to check max quantity
      const shoeInStock = shoes.find(s => s._id === item.shoe);
      if (shoeInStock && item.quantity >= shoeInStock.quantity) {
        alert("Cannot add more than available stock!");
        return;
      }
    }

    item.quantity += delta;
    if (item.quantity <= 0) {
      newCart.splice(index, 1);
    } else {
      item.subtotal = item.quantity * item.unitPrice;
    }
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.18;
  const total = taxableAmount + tax;

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
        // customer could be added here if we had a customer selector, 
        // keeping it simple per requirement
      });
      alert('Sale completed successfully!');
      setCart([]);
      setDiscount(0);
      fetchShoes(); // Refresh stock
    } catch (error) {
      console.error(error);
      alert('Error processing sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in h-[calc(100vh-100px)]">

      {/* Left Column: Products Grid (Takes 2 or 3 cols depending on screen) */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header & Search */}
        <div className="p-5 border-b border-gray-100 bg-white z-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Point of Sale</h2>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
        </div>

        {/* Product Grid Area - scrollable */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shoes.map(shoe => (
              <div
                key={shoe._id}
                className={`bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md 
                  \${shoe.quantity === 0 ? 'opacity-60 grayscale cursor-not-allowed border-gray-200' : 'border-transparent hover:border-blue-300'}`}
                onClick={() => shoe.quantity > 0 && addToCart(shoe)}
              >
                <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  {shoe.images && shoe.images[0] ? (
                    <img src={shoe.images[0]} alt={shoe.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaBox className="text-gray-300 text-4xl" />
                  )}
                  {shoe.quantity === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-gray-900 truncate" title={shoe.name}>{shoe.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{shoe.size} • {shoe.color}</p>
                    <p className="text-xs font-medium text-gray-600">Stock: {shoe.quantity}</p>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-blue-600">₹{shoe.sellingPrice}</span>
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                        \${shoe.quantity === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                      disabled={shoe.quantity === 0}
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {shoes.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <FaBox className="text-6xl mb-4" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Checkout/Cart Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">

        <div className="p-5 border-b border-gray-100 bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex justify-center items-center">
              <FaShoppingCart className="text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
          </div>
          <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
          </span>
        </div>

        {/* Cart Items - scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
              <FaShoppingCart className="text-6xl mb-4" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-2">Click on products to add them</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex gap-3">
                {/* Tiny image thumbnail */}
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.shoeName} className="w-full h-full object-cover" />
                  ) : (
                    <FaBox className="text-gray-300" />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden pr-2">
                      <p className="font-bold text-sm text-gray-900 truncate" title={item.shoeName}>{item.shoeName}</p>
                      <p className="text-xs text-gray-500 truncate">{item.size} • {item.color}</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600 transition-colors mt-0.5">
                      <FaTrash className="text-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 text-gray-700">
                        <FaMinus className="text-[10px]" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 text-gray-700">
                        <FaPlus className="text-[10px]" />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-gray-900">₹{(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation Summary */}
        <div className="p-5 border-t border-gray-200 bg-white">
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center group">
              <span className="text-gray-600">Discount (%)</span>
              <div className="relative">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-right font-medium focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount Amount</span>
                <span className="font-medium">-₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Tax (18%)</span>
              <span className="font-medium text-gray-900">₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-gray-300 mb-5">
            <div className="flex justify-between items-end">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total</span>
              <span className="text-3xl font-black text-blue-600">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
              \${cart.length === 0 || loading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'}`}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Checkout</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;

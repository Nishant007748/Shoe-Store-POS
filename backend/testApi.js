const jwt = require('jsonwebtoken');
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Shoe = require('./models/Shoe');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOne({ email: 'owner@shoestore.com' });
  const shoe = await Shoe.findOne({});
  const realToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  if(!shoe) { console.log('No shoes to buy'); process.exit(); }

  try {
    const payload = {
      items: [{
        shoe: shoe._id.toString(),
        shoeName: shoe.name,
        sku: shoe.sku,
        size: shoe.size,
        color: shoe.color,
        quantity: 1,
        unitPrice: shoe.sellingPrice,
        subtotal: shoe.sellingPrice
      }],
      subtotal: shoe.sellingPrice,
      discount: 0,
      discountPercentage: 0,
      tax: shoe.sellingPrice * 0.18,
      taxPercentage: 18,
      total: shoe.sellingPrice * 1.18,
      paymentMethod: 'Cash'
    };

    const res = await fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${realToken}`
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', text);
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  process.exit();
});

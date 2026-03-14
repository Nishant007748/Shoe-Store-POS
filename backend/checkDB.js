require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Customer = require('./models/Customer');

console.log('URI from ENV:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await User.find({});
  console.log('Users in DB (from ENv):', users.map(u => u.email));
  const customers = await Customer.find({});
  console.log('Total customers:', customers.length);
  process.exit();
}).catch(console.error);

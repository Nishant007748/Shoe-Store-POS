const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shoe-store-pos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const NewArrival = require('../models/NewArrival');
  
  const result = await NewArrival.deleteMany({
    name: { $regex: /yeezy boost/i }
  });
  
  console.log(`Deleted ${result.deletedCount} "Yeezy Boost" arrival(s).`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

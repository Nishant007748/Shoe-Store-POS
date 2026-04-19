const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shoe-pos')
.then(async () => {
  const NewArrival = require('../models/NewArrival');
  const all = await NewArrival.find({}, 'name images status');
  console.log(JSON.stringify(all, null, 2));
  process.exit(0);
});

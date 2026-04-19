const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shoe-pos')
.then(async () => {
  const Shoe = require('../models/Shoe');
  const all = await Shoe.find({}, 'name images');
  console.log(all);
  process.exit(0);
});

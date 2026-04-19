const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shoe-store-pos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const NewArrival = require('../models/NewArrival');
  
  const result = await NewArrival.deleteMany({
    $or: [
      { images: { $size: 0 } },
      { images: null },
      { 'images.0': '' },
      { images: { $exists: false } }
    ]
  });

  const Shoe = require('../models/Shoe');
  const result2 = await Shoe.deleteMany({
    $or: [
      { images: { $size: 0 } },
      { images: null },
      { 'images.0': '' },
      { images: { $exists: false } }
    ]
  });
  
  console.log(`Deleted ${result.deletedCount} bad arrivals. Deleted ${result2.deletedCount} bad shoes.`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

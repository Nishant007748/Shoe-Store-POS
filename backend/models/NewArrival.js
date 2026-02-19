const mongoose = require('mongoose');

const newArrivalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide shoe name'],
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Please specify a brand']
  },
  shoeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShoeType',
    required: [true, 'Please specify a shoe type']
  },
  size: {
    type: String,
    required: [true, 'Please specify size']
  },
  color: {
    type: String,
    required: [true, 'Please specify color'],
    trim: true
  },
  material: {
    type: String,
    required: [true, 'Please specify material'],
    enum: ['Leather', 'Synthetic', 'Canvas', 'Rubber', 'Mesh', 'Suede', 'Textile']
  },
  expectedQuantity: {
    type: Number,
    required: [true, 'Please specify expected quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  mrp: {
    type: Number,
    required: [true, 'Please provide MRP'],
    min: [0, 'MRP must be positive']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Please provide selling price'],
    min: [0, 'Selling price must be positive']
  },
  expectedDate: {
    type: Date,
    required: [true, 'Please provide expected arrival date']
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'arrived', 'cancelled'],
    default: 'pending'
  },
  arrivedDate: {
    type: Date
  },
  convertedToShoe: {
    type: Boolean,
    default: false
  },
  shoeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shoe'
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for queries
newArrivalSchema.index({ status: 1 });
newArrivalSchema.index({ expectedDate: 1 });

module.exports = mongoose.model('NewArrival', newArrivalSchema);

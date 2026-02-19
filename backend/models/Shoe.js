const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a shoe name'],
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
  sku: {
    type: String,
    unique: true,
    required: [true, 'Please provide SKU']
  },
  size: {
    type: String,
    required: [true, 'Please specify size'],
    enum: ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']
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
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
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
  images: [{
    type: String
  }],
  description: {
    type: String,
    trim: true
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  isLowStock: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  trialStatus: {
    status: {
      type: String,
      enum: ['available', 'in_trial', 'sold'],
      default: 'available'
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    trialStartTime: Date,
    trialEndTime: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Update low stock status before saving
shoeSchema.pre('save', function(next) {
  this.isLowStock = this.quantity <= this.lowStockThreshold && this.quantity > 0;
  next();
});

// Index for faster queries
shoeSchema.index({ brand: 1, shoeType: 1 });
shoeSchema.index({ sku: 1 });
shoeSchema.index({ isLowStock: 1 });

module.exports = mongoose.model('Shoe', shoeSchema);

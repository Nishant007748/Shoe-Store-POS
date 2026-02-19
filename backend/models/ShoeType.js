const mongoose = require('mongoose');

const shoeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a shoe type name'],
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Please specify a brand']
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique shoe type per brand
shoeTypeSchema.index({ name: 1, brand: 1 }, { unique: true });

module.exports = mongoose.model('ShoeType', shoeTypeSchema);

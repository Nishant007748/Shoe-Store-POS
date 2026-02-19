const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  shoe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shoe',
    required: true
  },
  shoeName: String,
  sku: String,
  size: String,
  color: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  customerName: String,
  customerPhone: String,
  items: [saleItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  taxPercentage: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Mixed'],
    required: true
  },
  paymentDetails: {
    cashAmount: Number,
    cardAmount: Number,
    upiAmount: Number,
    upiTransactionId: String
  },
  status: {
    type: String,
    enum: ['completed', 'cancelled', 'refunded'],
    default: 'completed'
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soldByName: String,
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate invoice number before saving
saleSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Find last invoice of the day
    const lastSale = await this.constructor.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}${day}`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastSale) {
      const lastSequence = parseInt(lastSale.invoiceNumber.split('-').pop());
      sequence = lastSequence + 1;
    }
    
    this.invoiceNumber = `INV-${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Index for faster queries
saleSchema.index({ invoiceNumber: 1 });
saleSchema.index({ customer: 1 });
saleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);

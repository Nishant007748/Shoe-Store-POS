const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    phone: {
      type: String,
    },

    requirements: {
      type: String,
    },

    transactionStatus: {
      type: String,
      enum: ["Purchased", "Not Purchased"],
      default: "Not Purchased",
    },

    reason: {
      type: String,
    },

    notes: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalPurchases: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    lastPurchaseDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
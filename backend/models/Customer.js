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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
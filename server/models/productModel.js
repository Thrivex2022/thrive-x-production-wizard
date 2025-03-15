const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    estimatedProductionTime: {
      type: Number, // in hours
      required: true,
      default: 1,
    },
    materials: [
      {
        name: String,
        quantity: Number,
        unit: String,
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);

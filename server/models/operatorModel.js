const mongoose = require('mongoose');

const operatorSchema = mongoose.Schema(
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
    role: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
      match: [/.+\@.+\..+/, 'Please add a valid email'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Operator', operatorSchema);

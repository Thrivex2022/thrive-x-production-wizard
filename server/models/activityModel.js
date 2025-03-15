const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
  {
    activityCode: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    description: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Operator',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'completed', 'paused'],
      default: 'pending',
    },
    plannedStartDate: {
      type: Date,
    },
    plannedEndDate: {
      type: Date,
    },
    actualStartDate: {
      type: Date,
    },
    actualEndDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      required: true,
    },
    actualHours: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Activity', activitySchema);

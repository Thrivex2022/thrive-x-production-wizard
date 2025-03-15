const Activity = require('../models/activityModel');
const Order = require('../models/orderModel');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  const activities = await Activity.find({})
    .populate('order')
    .populate('product')
    .populate('assignedTo');
  res.json(activities);
};

// @desc    Get activities by order ID
// @route   GET /api/activities/order/:orderId
// @access  Private
const getActivitiesByOrder = async (req, res) => {
  const activities = await Activity.find({ order: req.params.orderId })
    .populate('product')
    .populate('assignedTo');
  res.json(activities);
};

// @desc    Get activities by operator ID
// @route   GET /api/activities/operator/:operatorId
// @access  Private
const getActivitiesByOperator = async (req, res) => {
  const activities = await Activity.find({ assignedTo: req.params.operatorId })
    .populate('order')
    .populate('product');
  res.json(activities);
};

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Private
const getActivityById = async (req, res) => {
  const activity = await Activity.findById(req.params.id)
    .populate('order')
    .populate('product')
    .populate('assignedTo');

  if (activity) {
    res.json(activity);
  } else {
    res.status(404);
    throw new Error('Activity not found');
  }
};

// @desc    Assign activity to operator
// @route   PUT /api/activities/:id/assign
// @access  Private
const assignActivity = async (req, res) => {
  const { operatorId, plannedStartDate, plannedEndDate } = req.body;

  if (!operatorId) {
    res.status(400);
    throw new Error('Please provide an operator ID');
  }

  const activity = await Activity.findById(req.params.id);

  if (activity) {
    activity.assignedTo = operatorId;
    
    if (plannedStartDate) {
      activity.plannedStartDate = plannedStartDate;
    }
    
    if (plannedEndDate) {
      activity.plannedEndDate = plannedEndDate;
    }

    const updatedActivity = await activity.save();
    
    res.json(updatedActivity);
  } else {
    res.status(404);
    throw new Error('Activity not found');
  }
};

// @desc    Update activity status
// @route   PUT /api/activities/:id/status
// @access  Private
const updateActivityStatus = async (req, res) => {
  const { status, actualHours } = req.body;

  if (!status) {
    res.status(400);
    throw new Error('Please provide a status');
  }

  const activity = await Activity.findById(req.params.id);

  if (activity) {
    const previousStatus = activity.status;
    activity.status = status;

    // Update timestamps based on status changes
    if (status === 'in-progress' && previousStatus === 'pending') {
      activity.actualStartDate = Date.now();
    } else if (status === 'completed' && previousStatus !== 'completed') {
      activity.actualEndDate = Date.now();
      
      // If actual hours are provided, update them
      if (actualHours !== undefined) {
        activity.actualHours = actualHours;
      }
    }

    const updatedActivity = await activity.save();

    // Check if all activities for this order are completed
    if (status === 'completed') {
      const orderActivities = await Activity.find({ order: activity.order });
      const allCompleted = orderActivities.every(act => act.status === 'completed');
      
      if (allCompleted) {
        // Update order status to completed
        await Order.findByIdAndUpdate(activity.order, { status: 'completed' });
      }
    }

    res.json(updatedActivity);
  } else {
    res.status(404);
    throw new Error('Activity not found');
  }
};

// @desc    Update activity details
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  const {
    description,
    estimatedHours,
    actualHours,
    notes,
    priority,
  } = req.body;

  const activity = await Activity.findById(req.params.id);

  if (activity) {
    activity.description = description || activity.description;
    activity.estimatedHours = estimatedHours || activity.estimatedHours;
    
    if (actualHours !== undefined) {
      activity.actualHours = actualHours;
    }
    
    activity.notes = notes || activity.notes;
    activity.priority = priority || activity.priority;

    const updatedActivity = await activity.save();
    res.json(updatedActivity);
  } else {
    res.status(404);
    throw new Error('Activity not found');
  }
};

module.exports = {
  getActivities,
  getActivitiesByOrder,
  getActivitiesByOperator,
  getActivityById,
  assignActivity,
  updateActivityStatus,
  updateActivity,
};

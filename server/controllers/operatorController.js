const Operator = require('../models/operatorModel');
const Activity = require('../models/activityModel');

// @desc    Get all operators
// @route   GET /api/operators
// @access  Private
const getOperators = async (req, res) => {
  const operators = await Operator.find({});
  res.json(operators);
};

// @desc    Get operator by ID
// @route   GET /api/operators/:id
// @access  Private
const getOperatorById = async (req, res) => {
  const operator = await Operator.findById(req.params.id);

  if (operator) {
    res.json(operator);
  } else {
    res.status(404);
    throw new Error('Operator not found');
  }
};

// @desc    Create an operator
// @route   POST /api/operators
// @access  Private
const createOperator = async (req, res) => {
  const { code, name, role, skills, contactNumber, email, notes } = req.body;

  // Check required fields
  if (!code || !name || !role) {
    res.status(400);
    throw new Error('Please add required fields');
  }

  // Check if operator with this code already exists
  const operatorExists = await Operator.findOne({ code });
  if (operatorExists) {
    res.status(400);
    throw new Error('Operator with this code already exists');
  }

  // Create operator
  const operator = await Operator.create({
    code,
    name,
    role,
    skills: skills || [],
    contactNumber,
    email,
    notes,
    isActive: true,
  });

  if (operator) {
    res.status(201).json(operator);
  } else {
    res.status(400);
    throw new Error('Invalid operator data');
  }
};

// @desc    Update an operator
// @route   PUT /api/operators/:id
// @access  Private
const updateOperator = async (req, res) => {
  const { code, name, role, skills, contactNumber, email, isActive, notes } = req.body;

  const operator = await Operator.findById(req.params.id);

  if (operator) {
    // If code is changing, check it's not already in use
    if (code && code !== operator.code) {
      const codeExists = await Operator.findOne({ code });
      if (codeExists) {
        res.status(400);
        throw new Error('Operator with this code already exists');
      }
    }

    operator.code = code || operator.code;
    operator.name = name || operator.name;
    operator.role = role || operator.role;
    operator.skills = skills || operator.skills;
    operator.contactNumber = contactNumber || operator.contactNumber;
    operator.email = email || operator.email;
    operator.isActive = isActive !== undefined ? isActive : operator.isActive;
    operator.notes = notes || operator.notes;

    const updatedOperator = await operator.save();
    res.json(updatedOperator);
  } else {
    res.status(404);
    throw new Error('Operator not found');
  }
};

// @desc    Delete an operator
// @route   DELETE /api/operators/:id
// @access  Private
const deleteOperator = async (req, res) => {
  const operator = await Operator.findById(req.params.id);

  if (operator) {
    // Check if operator has any assigned activities
    const hasAssignedActivities = await Activity.findOne({ assignedTo: operator._id });
    
    if (hasAssignedActivities) {
      res.status(400);
      throw new Error('Cannot delete operator with assigned activities');
    }

    await operator.remove();
    res.json({ message: 'Operator removed' });
  } else {
    res.status(404);
    throw new Error('Operator not found');
  }
};

// @desc    Get operator workload
// @route   GET /api/operators/:id/workload
// @access  Private
const getOperatorWorkload = async (req, res) => {
  const operator = await Operator.findById(req.params.id);

  if (!operator) {
    res.status(404);
    throw new Error('Operator not found');
  }

  // Get all activities assigned to this operator
  const activities = await Activity.find({ 
    assignedTo: operator._id,
    status: { $in: ['pending', 'in-progress'] }
  })
    .populate('order')
    .populate('product');

  // Calculate total estimated hours
  const totalEstimatedHours = activities.reduce(
    (sum, activity) => sum + activity.estimatedHours,
    0
  );

  // Group activities by status
  const pending = activities.filter(a => a.status === 'pending');
  const inProgress = activities.filter(a => a.status === 'in-progress');

  res.json({
    operator: {
      _id: operator._id,
      name: operator.name,
      role: operator.role,
    },
    workload: {
      totalActivities: activities.length,
      pendingActivities: pending.length,
      inProgressActivities: inProgress.length,
      totalEstimatedHours,
    },
    activities,
  });
};

module.exports = {
  getOperators,
  getOperatorById,
  createOperator,
  updateOperator,
  deleteOperator,
  getOperatorWorkload,
};

const Order = require('../models/orderModel');
const Activity = require('../models/activityModel');
const Product = require('../models/productModel');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('items.product');
  res.json(orders);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const {
    orderNumber,
    customerName,
    customerContact,
    orderDate,
    deliveryDate,
    items,
    notes,
    priority,
  } = req.body;

  // Validate order data
  if (!orderNumber || !customerName || !customerContact || !deliveryDate || !items || items.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if order number already exists
  const orderExists = await Order.findOne({ orderNumber });
  if (orderExists) {
    res.status(400);
    throw new Error('Order with this number already exists');
  }

  // Calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${item.product} not found`);
    }
    totalAmount += product.price * item.quantity;
  }

  // Create order
  const order = await Order.create({
    orderNumber,
    customerName,
    customerContact,
    orderDate: orderDate || Date.now(),
    deliveryDate,
    items,
    totalAmount,
    notes,
    priority,
    status: 'pending',
  });

  if (order) {
    // Create activities for each order item
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      
      await Activity.create({
        activityCode: `ACT-${order.orderNumber}-${product.code}`,
        order: order._id,
        product: item.product,
        description: `Production of ${product.name} for order ${order.orderNumber}`,
        estimatedHours: product.estimatedProductionTime * item.quantity,
        status: 'pending',
        priority: order.priority,
      });
    }

    res.status(201).json(order);
  } else {
    res.status(400);
    throw new Error('Invalid order data');
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error('Please provide a status');
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;

    // If order is completed or cancelled, update related activities
    if (status === 'completed' || status === 'cancelled') {
      await Activity.updateMany(
        { order: order._id, status: { $ne: 'completed' } },
        { status: status === 'completed' ? 'completed' : 'paused' }
      );
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
  const {
    customerName,
    customerContact,
    deliveryDate,
    items,
    notes,
    priority,
  } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    // Only allow updates if order is not completed or cancelled
    if (order.status === 'completed' || order.status === 'cancelled') {
      res.status(400);
      throw new Error('Cannot update a completed or cancelled order');
    }

    // Update order fields
    order.customerName = customerName || order.customerName;
    order.customerContact = customerContact || order.customerContact;
    order.deliveryDate = deliveryDate || order.deliveryDate;
    order.notes = notes || order.notes;
    order.priority = priority || order.priority;

    // If items are updated, recalculate total and update activities
    if (items && items.length > 0) {
      order.items = items;
      
      // Recalculate total amount
      let totalAmount = 0;
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          res.status(404);
          throw new Error(`Product with ID ${item.product} not found`);
        }
        totalAmount += product.price * item.quantity;
      }
      order.totalAmount = totalAmount;

      // Update activities
      await Activity.deleteMany({ order: order._id });
      
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        
        await Activity.create({
          activityCode: `ACT-${order.orderNumber}-${product.code}`,
          order: order._id,
          product: item.product,
          description: `Production of ${product.name} for order ${order.orderNumber}`,
          estimatedHours: product.estimatedProductionTime * item.quantity,
          status: 'pending',
          priority: order.priority,
        });
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Delete related activities
    await Activity.deleteMany({ order: order._id });
    
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Operator = require('../models/operatorModel');
const Order = require('../models/orderModel');
const Activity = require('../models/activityModel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@thrivex.com',
    password: 'password123',
    isAdmin: true,
  },
];

const products = [
  {
    code: 'P001',
    name: 'Standard Cabinet',
    description: 'Standard kitchen cabinet with two shelves',
    price: 299.99,
    category: 'Cabinets',
    estimatedProductionTime: 4,
    materials: [
      {
        name: 'Wood Panel',
        quantity: 4,
        unit: 'sheet',
      },
      {
        name: 'Hinges',
        quantity: 2,
        unit: 'pair',
      },
    ],
  },
  {
    code: 'P002',
    name: 'Deluxe Wardrobe',
    description: 'Large wardrobe with mirror and hanging rail',
    price: 599.99,
    category: 'Wardrobes',
    estimatedProductionTime: 8,
    materials: [
      {
        name: 'Wood Panel',
        quantity: 8,
        unit: 'sheet',
      },
      {
        name: 'Mirror',
        quantity: 1,
        unit: 'piece',
      },
      {
        name: 'Rail',
        quantity: 1,
        unit: 'piece',
      },
    ],
  },
  {
    code: 'P003',
    name: 'Coffee Table',
    description: 'Modern coffee table with storage shelf',
    price: 199.99,
    category: 'Tables',
    estimatedProductionTime: 3,
    materials: [
      {
        name: 'Wood Panel',
        quantity: 3,
        unit: 'sheet',
      },
      {
        name: 'Legs',
        quantity: 4,
        unit: 'piece',
      },
    ],
  },
];

const operators = [
  {
    code: 'OP001',
    name: 'Marco Rossi',
    role: 'Production Manager',
    skills: ['Woodworking', 'Quality Inspection'],
    contactNumber: '555-1234',
    email: 'marco@thrivex.com',
    isActive: true,
  },
  {
    code: 'OP002',
    name: 'Giulia Bianchi',
    role: 'Assembler',
    skills: ['Woodworking', 'Painting'],
    contactNumber: '555-2345',
    email: 'giulia@thrivex.com',
    isActive: true,
  },
  {
    code: 'OP003',
    name: 'Luca Verdi',
    role: 'Technician',
    skills: ['Metalworking', 'Welding'],
    contactNumber: '555-3456',
    email: 'luca@thrivex.com',
    isActive: true,
  },
];

// Seed database function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Operator.deleteMany({});
    await Order.deleteMany({});
    await Activity.deleteMany({});

    console.log('Database cleared');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }

    console.log(`${createdUsers.length} users created`);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    // Create operators
    const createdOperators = await Operator.insertMany(operators);
    console.log(`${createdOperators.length} operators created`);

    // Create an order
    const order = {
      orderNumber: 'ORD-2023-001',
      customerName: 'Sample Customer',
      customerContact: 'customer@example.com',
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'pending',
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 2,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[2]._id,
          quantity: 1,
          price: createdProducts[2].price,
        },
      ],
      totalAmount: createdProducts[0].price * 2 + createdProducts[2].price,
      priority: 'medium',
    };

    const createdOrder = await Order.create(order);
    console.log(`Order ${createdOrder.orderNumber} created`);

    // Create activities for the order
    const activities = [
      {
        activityCode: `ACT-${createdOrder.orderNumber}-${createdProducts[0].code}-1`,
        order: createdOrder._id,
        product: createdProducts[0]._id,
        description: `Production of ${createdProducts[0].name} (1 of 2) for order ${createdOrder.orderNumber}`,
        assignedTo: createdOperators[1]._id, // Assign to Giulia
        status: 'in-progress',
        plannedStartDate: new Date(),
        plannedEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        actualStartDate: new Date(),
        estimatedHours: createdProducts[0].estimatedProductionTime,
        priority: order.priority,
      },
      {
        activityCode: `ACT-${createdOrder.orderNumber}-${createdProducts[0].code}-2`,
        order: createdOrder._id,
        product: createdProducts[0]._id,
        description: `Production of ${createdProducts[0].name} (2 of 2) for order ${createdOrder.orderNumber}`,
        status: 'pending',
        estimatedHours: createdProducts[0].estimatedProductionTime,
        priority: order.priority,
      },
      {
        activityCode: `ACT-${createdOrder.orderNumber}-${createdProducts[2].code}`,
        order: createdOrder._id,
        product: createdProducts[2]._id,
        description: `Production of ${createdProducts[2].name} for order ${createdOrder.orderNumber}`,
        assignedTo: createdOperators[2]._id, // Assign to Luca
        status: 'pending',
        plannedStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        plannedEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        estimatedHours: createdProducts[2].estimatedProductionTime,
        priority: order.priority,
      },
    ];

    const createdActivities = await Activity.insertMany(activities);
    console.log(`${createdActivities.length} activities created`);

    console.log('Database seeded successfully');

    // Print login information
    console.log('\nYou can now log in with:');
    console.log(`Email: ${users[0].email}`);
    console.log(`Password: password123`);

    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

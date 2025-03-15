const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { 
    code, 
    name, 
    description, 
    price, 
    category, 
    estimatedProductionTime, 
    materials, 
    notes 
  } = req.body;

  // Check if product with the same code already exists
  const productExists = await Product.findOne({ code });
  if (productExists) {
    res.status(400);
    throw new Error('Product with this code already exists');
  }

  const product = await Product.create({
    code,
    name,
    description,
    price,
    category,
    estimatedProductionTime,
    materials,
    notes,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error('Invalid product data');
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    code,
    name,
    description,
    price,
    category,
    estimatedProductionTime,
    materials,
    notes,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // If code is being changed, make sure it's not already in use
    if (code !== product.code) {
      const codeExists = await Product.findOne({ code });
      if (codeExists) {
        res.status(400);
        throw new Error('Product with this code already exists');
      }
    }

    product.code = code || product.code;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.estimatedProductionTime = estimatedProductionTime || product.estimatedProductionTime;
    product.materials = materials || product.materials;
    product.notes = notes || product.notes;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

const Product = require('../models/Product');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    search,
    minPrice,
    maxPrice,
    isAvailable,
    isFeatured,
  } = req.query;

  // Build query
  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  if (isAvailable !== undefined) {
    query.isAvailable = isAvailable === 'true';
  }

  if (isFeatured !== undefined) {
    query.isFeatured = isFeatured === 'true';
  }

  // Price filter (check variants)
  if (minPrice || maxPrice) {
    query['variants.price'] = {};
    if (minPrice) query['variants.price'].$gte = Number(minPrice);
    if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .sort(sort)
    .limit(Number(limit))
    .skip(skip)
    .select('-__v');

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: products,
  });
});

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res) => {
  const mongoose = require('mongoose');
  const query = { slug: req.params.id };
  
  // If the parameter is a valid MongoDB ObjectId, search by _id as well
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    query.$or = [{ _id: req.params.id }, { slug: req.params.id }];
    delete query.slug;
  }
  
  const product = await Product.findOne(query);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res) => {
  // TODO: Implement image upload logic (use multer + AWS S3 or cloudinary)
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // TODO: Implement logic to delete associated images from storage
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: {},
  });
});

/**
 * @desc    Update product stock
 * @route   PATCH /api/products/:id/stock
 * @access  Private/Admin
 */
exports.updateStock = asyncHandler(async (req, res) => {
  const { variantId, quantity, operation } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  const variant = product.variants.id(variantId);
  
  if (!variant) {
    return res.status(404).json({
      success: false,
      message: 'Variant not found',
    });
  }

  // Update stock based on operation
  if (operation === 'add') {
    variant.stock += quantity;
  } else if (operation === 'subtract') {
    variant.stock = Math.max(0, variant.stock - quantity);
  } else if (operation === 'set') {
    variant.stock = quantity;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    data: product,
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isFeatured: true,
    isAvailable: true,
  })
    .sort('-createdAt')
    .limit(10);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

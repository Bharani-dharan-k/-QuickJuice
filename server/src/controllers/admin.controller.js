const Order = require('../models/Order');
const Rider = require('../models/Rider');
const User = require('../models/User');
const Product = require('../models/Product');
const { asyncHandler } = require('../utils/helpers');
const { emitToOrder, emitToRiders } = require('../config/socket');
const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * @desc    Get all orders (admin dashboard)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
exports.getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip)
    .populate('customer', 'name email phone')
    .populate('rider', 'user vehicleType vehicleNumber');

  const total = await Order.countDocuments(query);

  // Get statistics
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$pricing.total' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    stats,
    data: orders,
  });
});

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  order.status = status;
  if (note) {
    order.statusHistory[order.statusHistory.length - 1].note = note;
  }
  await order.save();

  // Emit real-time event
  emitToOrder(order._id, 'order:status', {
    status,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order,
  });
});

/**
 * @desc    Assign rider to order
 * @route   PUT /api/admin/orders/:id/assign-rider
 * @access  Private/Admin
 */
exports.assignRider = asyncHandler(async (req, res) => {
  const { riderId } = req.body;

  const order = await Order.findById(req.params.id);
  const rider = await Rider.findById(riderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  if (rider.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'Rider is not available',
    });
  }

  order.rider = riderId;
  order.status = 'confirmed';
  await order.save();

  rider.status = 'busy';
  rider.activeOrder = order._id;
  await rider.save();

  // TODO: Notify rider via push notification

  // Emit real-time event
  emitToOrder(order._id, 'order:rider-assigned', {
    rider: rider._id,
    orderNumber: order.orderNumber,
  });

  res.status(200).json({
    success: true,
    message: 'Rider assigned successfully',
    data: order,
  });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    activeOrders,
    totalRevenue,
    todayRevenue,
    totalCustomers,
    activeRiders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'preparing', 'on_the_way'] },
    }),
    Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          'payment.status': 'completed',
        },
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    User.countDocuments({ role: 'customer' }),
    Rider.countDocuments({ status: { $in: ['available', 'busy'] } }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      todayOrders,
      activeOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      totalCustomers,
      activeRiders,
    },
  });
});

/**
 * @desc    Get all riders
 * @route   GET /api/admin/riders
 * @access  Private/Admin
 */
exports.getAllRiders = asyncHandler(async (req, res) => {
  const { status, isActive } = req.query;

  const query = {};
  if (status) query.status = status;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const riders = await Rider.find(query).populate('user', 'name email phone');

  res.status(200).json({
    success: true,
    count: riders.length,
    data: riders,
  });
});

/**
 * @desc    Get all products (admin view)
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort('-createdAt');

  // Calculate low stock products
  const lowStockProducts = products.filter((p) => p.totalStock < 10);

  res.status(200).json({
    success: true,
    count: products.length,
    lowStockCount: lowStockProducts.length,
    data: products,
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, isActive } = req.query;

  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const users = await User.find(query).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['customer', 'rider', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: user,
  });
});

/**
 * @desc    Update user status
 * @route   PUT /api/admin/users/:id/status
 * @access  Private/Admin
 */
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.isActive = status === 'active';
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
    data: user,
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    variants,
    ingredients,
    nutritionalInfo,
    tags,
    discount,
  } = req.body;

  // Upload images to Cloudinary
  const imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      imageUrls.push({
        url: result.secure_url,
        alt: name,
        isPrimary: imageUrls.length === 0, // First image is primary
      });
    }
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Create product
  const product = await Product.create({
    name,
    slug,
    description,
    category,
    variants: JSON.parse(variants),
    images: imageUrls,
    ingredients: JSON.parse(ingredients || '[]'),
    nutritionalInfo: nutritionalInfo ? JSON.parse(nutritionalInfo) : undefined,
    tags: JSON.parse(tags || '[]'),
    discount: discount ? JSON.parse(discount) : undefined,
    isAvailable: true,
    ratings: {
      average: 0,
      count: 0,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

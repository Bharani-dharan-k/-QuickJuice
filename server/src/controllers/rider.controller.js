const Order = require('../models/Order');
const Rider = require('../models/Rider');
const { asyncHandler } = require('../utils/helpers');
const { emitToOrder } = require('../config/socket');

/**
 * @desc    Get rider profile
 * @route   GET /api/rider/profile
 * @access  Private/Rider
 */
exports.getRiderProfile = asyncHandler(async (req, res) => {
  const rider = await Rider.findOne({ user: req.user._id }).populate(
    'user',
    'name email phone avatar'
  );

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider profile not found',
    });
  }

  res.status(200).json({
    success: true,
    data: rider,
  });
});

/**
 * @desc    Update rider status (online/offline/busy)
 * @route   PUT /api/rider/status
 * @access  Private/Rider
 */
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const rider = await Rider.findOne({ user: req.user._id });

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  rider.status = status;
  await rider.save();

  res.status(200).json({
    success: true,
    message: 'Status updated',
    data: rider,
  });
});

/**
 * @desc    Update rider location
 * @route   PUT /api/rider/location
 * @access  Private/Rider
 */
exports.updateLocation = asyncHandler(async (req, res) => {
  const { coordinates } = req.body; // [longitude, latitude]

  const rider = await Rider.findOne({ user: req.user._id });

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  await rider.updateLocation(coordinates);

  // If rider has active order, emit location update
  if (rider.activeOrder) {
    emitToOrder(rider.activeOrder, 'order:location', {
      coordinates,
      timestamp: new Date(),
    });
  }

  res.status(200).json({
    success: true,
    message: 'Location updated',
  });
});

/**
 * @desc    Get assigned orders
 * @route   GET /api/rider/orders
 * @access  Private/Rider
 */
exports.getAssignedOrders = asyncHandler(async (req, res) => {
  const rider = await Rider.findOne({ user: req.user._id });

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  const orders = await Order.find({
    rider: rider._id,
    status: { $nin: ['delivered', 'cancelled'] },
  })
    .populate('customer', 'name phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Get order history
 * @route   GET /api/rider/history
 * @access  Private/Rider
 */
exports.getOrderHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const rider = await Rider.findOne({ user: req.user._id });

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  const skip = (page - 1) * limit;
  const orders = await Order.find({
    rider: rider._id,
    status: { $in: ['delivered', 'cancelled'] },
  })
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip)
    .populate('customer', 'name');

  const total = await Order.countDocuments({
    rider: rider._id,
    status: { $in: ['delivered', 'cancelled'] },
  });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: orders,
  });
});

/**
 * @desc    Update order status by rider
 * @route   PUT /api/rider/orders/:id/status
 * @access  Private/Rider
 */
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const rider = await Rider.findOne({ user: req.user._id });

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  const order = await Order.findOne({
    _id: req.params.id,
    rider: rider._id,
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or not assigned to you',
    });
  }

  // Validate status transition
  const validTransitions = {
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['picked_up', 'cancelled'],
    picked_up: ['on_the_way'],
    on_the_way: ['delivered'],
  };

  if (!validTransitions[order.status]?.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status transition',
    });
  }

  order.status = status;

  if (status === 'delivered') {
    order.actualDeliveryTime = new Date();
    rider.status = 'available';
    rider.activeOrder = null;
    rider.stats.completedDeliveries += 1;
    await rider.save();
  }

  await order.save();

  // Emit real-time event to customer
  emitToOrder(order._id, 'order:status', {
    status,
    timestamp: new Date(),
  });

  // TODO: Send push notification to customer

  res.status(200).json({
    success: true,
    message: 'Order status updated',
    data: order,
  });
});

/**
 * @desc    Accept order assignment
 * @route   POST /api/rider/orders/:id/accept
 * @access  Private/Rider
 */
exports.acceptOrder = asyncHandler(async (req, res) => {
  const rider = await Rider.findOne({ user: req.user._id });

  if (!rider) {
    return res.status(404).json({
      success: false,
      message: 'Rider not found',
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order || order.rider.toString() !== rider._id.toString()) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  order.status = 'preparing';
  await order.save();

  rider.stats.totalDeliveries += 1;
  await rider.save();

  emitToOrder(order._id, 'order:accepted', {
    riderId: rider._id,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Order accepted',
    data: order,
  });
});

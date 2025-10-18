const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../utils/helpers');
const { processPayment } = require('../services/payment.service');
const { emitToUser, emitToAdmins } = require('../config/socket');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create order from cart (checkout)
 * @route   POST /api/orders/checkout
 * @access  Private
 */
exports.checkout = asyncHandler(async (req, res) => {
  const { deliveryAddress, paymentMethod, paymentDetails } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty',
    });
  }

  // Validate stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    const variant = product.variants.find((v) => v.size === item.variant.size);

    if (variant.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name} (${variant.size})`,
        product: product.name,
      });
    }
  }

  // Calculate pricing
  const subtotal = cart.subtotal;
  const discount = cart.discountAmount || 0;
  const deliveryFee = 2.99; // TODO: Calculate based on distance
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + deliveryFee + tax;

  // Process payment
  let paymentResult;
  try {
    paymentResult = await processPayment({
      amount: total,
      method: paymentMethod,
      details: paymentDetails,
      customerId: req.user._id,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Payment failed',
      error: error.message,
    });
  }

  // Create order
  const order = await Order.create({
    customer: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      addons: item.addons,
    })),
    pricing: {
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
    },
    deliveryAddress,
    payment: {
      method: paymentMethod,
      status: 'completed',
      transactionId: paymentResult.transactionId,
      paidAt: new Date(),
    },
    coupon: cart.coupon,
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  });

  // Update product stock
  for (const item of cart.items) {
    await Product.updateOne(
      { _id: item.product._id, 'variants.size': item.variant.size },
      { $inc: { 'variants.$.stock': -item.quantity } }
    );
  }

  // Clear cart
  cart.items = [];
  cart.coupon = undefined;
  await cart.save();

  // Emit real-time event to admins
  emitToAdmins('order:new', { orderId: order._id, orderNumber: order.orderNumber });

  // TODO: Send order confirmation email
  // TODO: Send SMS notification

  console.log('Order created with ID:', order._id);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

/**
 * @desc    Get order details
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email phone')
    .populate('items.product', 'name images')
    .populate('rider', 'user vehicleType vehicleNumber');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Check authorization
  if (
    order.customer._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin' &&
    req.user.role !== 'rider'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this order',
    });
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { customer: req.user._id };
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  const orders = await Order.find(query)
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip)
    .populate('items.product', 'name images');

  const total = await Order.countDocuments(query);

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
 * @desc    Cancel order
 * @route   POST /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Check authorization
  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this order',
    });
  }

  // Check if order can be cancelled
  if (['delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled',
    });
  }

  order.status = 'cancelled';
  order.cancellationReason = reason;
  await order.save();

  // Restore product stock
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product, 'variants.size': item.variant.size },
      { $inc: { 'variants.$.stock': item.quantity } }
    );
  }

  // TODO: Process refund if payment was made
  // TODO: Notify rider and admin

  // Emit real-time event
  emitToUser(order.customer, 'order:cancelled', { orderId: order._id });

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order,
  });
});

/**
 * @desc    Rate order
 * @route   POST /api/orders/:id/rate
 * @access  Private
 */
exports.rateOrder = asyncHandler(async (req, res) => {
  const { score, comment } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  if (order.status !== 'delivered') {
    return res.status(400).json({
      success: false,
      message: 'Can only rate delivered orders',
    });
  }

  order.rating = {
    score,
    comment,
    timestamp: new Date(),
  };
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    data: order,
  });
});

/**
 * @desc    Handle Stripe webhook
 * @route   POST /api/webhooks/stripe
 * @access  Public
 */
exports.handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // TODO: Update order payment status
      break;
    case 'payment_intent.payment_failed':
      // TODO: Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

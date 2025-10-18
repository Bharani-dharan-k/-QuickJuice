const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name images slug'
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1, addons = [] } = req.body;

  // Validate product and variant
  const product = await Product.findById(productId);
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

  // Check stock availability
  if (variant.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient stock',
      availableStock: variant.stock,
    });
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.variant.size === variant.size
  );

  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += quantity;
    
    // Check stock again
    if (cart.items[existingItemIndex].quantity > variant.stock) {
      return res.status(400).json({
        success: false,
        message: 'Quantity exceeds available stock',
        availableStock: variant.stock,
      });
    }
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      variant: {
        size: variant.size,
        volume: variant.volume,
        price: variant.price,
      },
      quantity,
      price: variant.price,
      addons,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name images slug');

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart,
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update/:itemId
 * @access  Private
 */
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found',
    });
  }

  const item = cart.items.id(itemId);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found in cart',
    });
  }

  // Validate stock
  const product = await Product.findById(item.product);
  const variant = product.variants.find((v) => v.size === item.variant.size);

  if (quantity > variant.stock) {
    return res.status(400).json({
      success: false,
      message: 'Quantity exceeds available stock',
      availableStock: variant.stock,
    });
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name images slug');

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: cart,
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:itemId
 * @access  Private
 */
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found',
    });
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  await cart.save();
  await cart.populate('items.product', 'name images slug');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart,
  });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    cart.items = [];
    cart.coupon = undefined;
    await cart.save();
  }

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: cart,
  });
});

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/apply-coupon
 * @access  Private
 */
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  // TODO: Implement coupon validation logic
  // - Check if coupon exists
  // - Check if coupon is valid (not expired, usage limit, etc.)
  // - Calculate discount

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found',
    });
  }

  // Example coupon logic (replace with actual database lookup)
  const mockCoupon = {
    code: 'FIRST10',
    discount: 10,
    type: 'percentage',
  };

  if (code !== mockCoupon.code) {
    return res.status(400).json({
      success: false,
      message: 'Invalid coupon code',
    });
  }

  cart.coupon = mockCoupon;
  await cart.save();
  await cart.populate('items.product', 'name images slug');

  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully',
    data: cart,
  });
});

/**
 * @desc    Remove coupon from cart
 * @route   DELETE /api/cart/remove-coupon
 * @access  Private
 */
exports.removeCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    cart.coupon = undefined;
    await cart.save();
    await cart.populate('items.product', 'name images slug');
  }

  res.status(200).json({
    success: true,
    message: 'Coupon removed',
    data: cart,
  });
});

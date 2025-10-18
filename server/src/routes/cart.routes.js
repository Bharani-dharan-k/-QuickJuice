const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validate,
  addToCartRules,
  mongoIdParam,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCartRules, validate, addToCart);
router.put('/update/:itemId', mongoIdParam('itemId'), validate, updateCartItem);
router.delete('/remove/:itemId', mongoIdParam('itemId'), validate, removeFromCart);
router.delete('/clear', clearCart);
router.post('/apply-coupon', applyCoupon);
router.delete('/remove-coupon', removeCoupon);

module.exports = router;

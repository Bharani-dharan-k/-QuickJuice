const express = require('express');
const {
  checkout,
  getOrder,
  getMyOrders,
  cancelOrder,
  rateOrder,
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validate,
  checkoutRules,
  mongoIdParam,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/checkout', checkoutRules, validate, checkout);
router.get('/', getMyOrders);
router.get('/:id', mongoIdParam('id'), validate, getOrder);
router.post('/:id/cancel', mongoIdParam('id'), validate, cancelOrder);
router.post('/:id/rate', mongoIdParam('id'), validate, rateOrder);

module.exports = router;

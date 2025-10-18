const express = require('express');
const {
  getRiderProfile,
  updateStatus,
  updateLocation,
  getAssignedOrders,
  getOrderHistory,
  updateOrderStatus,
  acceptOrder,
} = require('../controllers/rider.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validate, mongoIdParam } = require('../middlewares/validate.middleware');

const router = express.Router();

// All rider routes require authentication and rider role
router.use(protect, authorize('rider'));

router.get('/profile', getRiderProfile);
router.put('/status', updateStatus);
router.put('/location', updateLocation);
router.get('/orders', getAssignedOrders);
router.get('/history', getOrderHistory);
router.put('/orders/:id/status', mongoIdParam('id'), validate, updateOrderStatus);
router.post('/orders/:id/accept', mongoIdParam('id'), validate, acceptOrder);

module.exports = router;

const express = require('express');
const {
  getAllOrders,
  updateOrderStatus,
  assignRider,
  getDashboardStats,
  getAllRiders,
  getAllProducts,
  getAllUsers,
  createProduct,
  updateUserRole,
  updateUserStatus,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { validate, mongoIdParam } = require('../middlewares/validate.middleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', mongoIdParam('id'), validate, updateOrderStatus);
router.put('/orders/:id/assign-rider', mongoIdParam('id'), validate, assignRider);
router.get('/riders', getAllRiders);
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 5), createProduct);
router.get('/users', getAllUsers);
router.put('/users/:id/role', mongoIdParam('id'), validate, updateUserRole);
router.put('/users/:id/status', mongoIdParam('id'), validate, updateUserStatus);

module.exports = router;

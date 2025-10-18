const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getFeaturedProducts,
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
  validate,
  createProductRules,
  mongoIdParam,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.use(protect, authorize('admin'));
router.post('/', createProductRules, validate, createProduct);
router.put('/:id', mongoIdParam('id'), validate, updateProduct);
router.delete('/:id', mongoIdParam('id'), validate, deleteProduct);
router.patch('/:id/stock', mongoIdParam('id'), validate, updateStock);

module.exports = router;

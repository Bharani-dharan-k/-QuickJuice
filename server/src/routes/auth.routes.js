const express = require('express');
const {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validate,
  signupRules,
  loginRules,
} = require('../middlewares/validate.middleware');

const router = express.Router();

// Public routes
router.post('/signup', signupRules, validate, signup);
router.post('/login', loginRules, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.post('/logout', logout);

module.exports = router;

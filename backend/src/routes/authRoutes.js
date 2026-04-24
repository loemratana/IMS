const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'manager', 'staff'])
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required')
];

const resetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Public routes
router.post('/register', validate(registerValidation), (req, res, next) => authController.register(req, res, next));
router.post('/login', validate(loginValidation), (req, res, next) => authController.login(req, res, next));
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));
router.post('/forgot-password', validate(forgotPasswordValidation), (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', validate(resetPasswordValidation), (req, res, next) => authController.resetPassword(req, res, next));
// Protected routes
router.post('/logout', protect, (req, res, next) => authController.logout(req, res, next));
router.get('/me', protect, (req, res, next) => authController.getMe(req, res, next));
router.post('/change-password', protect, validate(changePasswordValidation), (req, res, next) => authController.changePassword(req, res, next));

module.exports = router;
const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/restrictTo');
const { body, param } = require('express-validator');

const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();
// Validation rules
const createPurchaseValidation = [
    body('supplierId').notEmpty().withMessage('Supplier ID required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item required'),
    body('items.*.productId').notEmpty().withMessage('Product ID required for each item'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('expectedDate').optional().isISO8601().withMessage('Invalid date format'),
    body('notes').optional().trim()
];

const approveValidation = [
    param('id').isUUID().withMessage('Invalid purchase ID'),
    body('notes').optional().trim()
];

const rejectValidation = [
    param('id').isUUID().withMessage('Invalid purchase ID'),
    body('reason').notEmpty().withMessage('Rejection reason required')
];

const idValidation = [
    param('id').isUUID().withMessage('Invalid purchase ID')
];

// All routes require authentication
router.use(protect);

// Purchase order routes
router.post('/',
    restrictTo('admin', 'manager'),
    validate(createPurchaseValidation),
    purchaseController.createPurchaseOrder
);

router.get('/',
    purchaseController.getAllPurchaseOrders
);

router.get('/:id',
    validate(idValidation),
    purchaseController.getPurchaseOrderById
);

router.put('/:id/approve',
    restrictTo('admin', 'manager'),
    validate(approveValidation),
    purchaseController.approvePurchaseOrder
);

router.post('/:id/receive',
    restrictTo('admin', 'manager', 'staff'),
    validate(idValidation),
    purchaseController.receivePurchaseOrderItems
);

module.exports = router;

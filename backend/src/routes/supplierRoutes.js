const express = require('express');
const supplierController = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/restrictTo');
const { validate } = require('../middleware/validationMiddleware');
const { body, param } = require('express-validator');

const router = express.Router();

// Validation rules
const createSupplierValidation = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('type').optional().isIn(['REGULAR', 'PREMIUM', 'STRATEGIC']),
    body('notes').optional().trim()
];

const updateSupplierValidation = [
    param('id').isUUID().withMessage('Invalid supplier ID'),
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('type').optional().isIn(['REGULAR', 'PREMIUM', 'STRATEGIC']),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    body('notes').optional().trim()
];

const idValidation = [
    param('id').isUUID().withMessage('Invalid supplier ID')
];

const bulkDeleteValidation = [
    body('ids').isArray().withMessage('IDs must be an array'),
    body('ids.*').isUUID().withMessage('Each ID must be a valid UUID')
];

// All routes require authentication
router.use(protect);

// Supplier routes
router.post('/',
    restrictTo('admin', 'manager'),
    validate(createSupplierValidation),
    supplierController.createSupplier
);

router.get('/',
    supplierController.getAllSuppliers
);

router.get('/:id', validate(idValidation), supplierController.getSupplierById);
router.put('/:id', restrictTo('admin', 'manager'), validate(updateSupplierValidation), supplierController.updateSupplier);
router.delete('/:id', restrictTo('admin'), validate(idValidation), supplierController.deleteSupplier);
router.delete('/:id/permanent',
    restrictTo('admin'),
    validate(idValidation),
    supplierController.hardDeleteSupplier
);


module.exports = router;


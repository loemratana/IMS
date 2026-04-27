const { body, param } = require('express-validator');

const createCustomerValidation = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('type').optional().isIn(['RETAIL', 'WHOLESALE', 'CORPORATE', 'GOVERNMENT']),
    body('notes').optional().trim()
];

const updateCustomerValidation = [
    param('id').isUUID().withMessage('Invalid customer ID'),
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('type').optional().isIn(['RETAIL', 'WHOLESALE', 'CORPORATE', 'GOVERNMENT']),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE']),
    body('notes').optional().trim()
];

const idValidation = [
    param('id').isUUID().withMessage('Invalid customer ID')
];

const bulkDeleteValidation = [
    body('ids').isArray().withMessage('IDs must be an array'),
    body('ids.*').isUUID().withMessage('Each ID must be a valid UUID')
];

module.exports = {
    createCustomerValidation,
    updateCustomerValidation,
    idValidation,
    bulkDeleteValidation
};

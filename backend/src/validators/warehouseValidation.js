const { body, param } = require('express-validator');

const warehouseValidation = {
    create: [
        body('name')
            .notEmpty()
            .withMessage('Warehouse name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Warehouse name must be between 2 and 100 characters')
            .trim()
            .escape(),

        body('code')
            .optional({ checkFalsy: true })
            .trim()
            .toUpperCase()
            .isLength({ min: 2, max: 20 })
            .withMessage('Warehouse code must be between 2 and 20 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Warehouse code can only contain letters, numbers, underscores, and hyphens'),

        body('location')
            .optional({ checkFalsy: true })
            .isLength({ max: 200 })
            .withMessage('Location cannot exceed 200 characters')
            .trim()
            .escape(),

        body('address')
            .optional({ checkFalsy: true })
            .isLength({ max: 500 })
            .withMessage('Address cannot exceed 500 characters')
            .trim()
            .escape(),

        body('contactPerson')
            .optional({ checkFalsy: true })
            .isLength({ max: 100 })
            .withMessage('Contact person name cannot exceed 100 characters')
            .trim()
            .escape(),

        body('phone')
            .optional({ checkFalsy: true })
            .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
            .withMessage('Please provide a valid phone number')
            .trim(),

        body('capacity')
            .optional({ checkFalsy: true })
            .isInt({ min: 0 })
            .withMessage('Capacity must be a positive integer')
            .toInt(),

        body('description')
            .optional({ checkFalsy: true })
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters')
            .trim()
            .escape()
    ],

    update: [
        param('id')
            .isUUID()
            .withMessage('Invalid warehouse ID format'),

        body('name')
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage('Warehouse name must be between 2 and 100 characters')
            .trim()
            .escape(),

        body('code')
            .optional()
            .isLength({ min: 2, max: 20 })
            .withMessage('Warehouse code must be between 2 and 20 characters')
            .matches(/^[A-Z0-9_-]+$/)
            .withMessage('Warehouse code can only contain uppercase letters, numbers, underscores, and hyphens')
            .trim()
            .toUpperCase(),

        body('isActive')
            .optional()
            .isBoolean()
            .withMessage('isActive must be a boolean')
            .toBoolean(),

        body('capacity')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Capacity must be a positive integer')
            .toInt()
    ],

    idParam: [
        param('id')
            .isUUID()
            .withMessage('Invalid warehouse ID format')
    ],

    transferStock: [
        body('fromWarehouseId')
            .notEmpty()
            .withMessage('Source warehouse ID is required')
            .isUUID()
            .withMessage('Invalid source warehouse ID format'),

        body('toWarehouseId')
            .notEmpty()
            .withMessage('Target warehouse ID is required')
            .isUUID()
            .withMessage('Invalid target warehouse ID format')
            .custom((toId, { req }) => {
                if (toId === req.body.fromWarehouseId) {
                    throw new Error('Source and target warehouses must be different');
                }
                return true;
            }),

        body('productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isUUID()
            .withMessage('Invalid product ID format'),

        body('quantity')
            .notEmpty()
            .withMessage('Quantity is required')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer')
            .toInt(),

        body('reason')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Reason cannot exceed 500 characters')
            .trim()
            .escape()
    ],

    adjustStock: [
        body('warehouseId')
            .notEmpty()
            .withMessage('Warehouse ID is required')
            .isUUID()
            .withMessage('Invalid warehouse ID format'),

        body('productId')
            .notEmpty()
            .withMessage('Product ID is required')
            .isUUID()
            .withMessage('Invalid product ID format'),

        body('quantity')
            .notEmpty()
            .withMessage('Quantity is required')
            .isInt({ min: 1 })
            .withMessage('Quantity must be a positive integer')
            .toInt(),

        body('type')
            .notEmpty()
            .withMessage('Adjustment type is required')
            .isIn(['IN', 'OUT'])
            .withMessage('Adjustment type must be IN or OUT'),

        body('reason')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Reason cannot exceed 500 characters')
            .trim()
            .escape()
    ]
};

module.exports = warehouseValidation;
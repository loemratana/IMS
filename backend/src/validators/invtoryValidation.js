const { body } = require('express-validator');

const inventoryValidation = {
    stockIn: [
        body('productId').isUUID().withMessage('Valid product ID required'),
        body('warehouseId').isUUID().withMessage('Valid warehouse ID required'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('referenceNo').optional().isString().trim(),
        body('supplierId').optional().isUUID().withMessage('Valid supplier ID required'),
        body('purchaseOrderNo').optional().isString().trim(),
        body('batchNo').optional().isString().trim(),
        body('expiryDate').optional().isISO8601().withMessage('Valid expiry date required'),
        body('unitCost').optional().isFloat({ min: 0 }).withMessage('Unit cost must be positive'),
        body('notes').optional().isString().trim()
    ],

    stockOut: [
        body('productId').isUUID().withMessage('Valid product ID required'),
        body('warehouseId').isUUID().withMessage('Valid warehouse ID required'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('referenceNo').optional().isString().trim(),
        body('customerId').optional().isUUID().withMessage('Valid customer ID required'),
        body('salesOrderNo').optional().isString().trim(),
        body('reason').optional().isString().trim(),
        body('notes').optional().isString().trim()
    ],

    transferStock: [
        body('fromWarehouseId').isUUID().withMessage('Valid source warehouse ID required'),
        body('toWarehouseId').isUUID().withMessage('Valid target warehouse ID required')
            .custom((toId, { req }) => {
                if (toId === req.body.fromWarehouseId) {
                    throw new Error('Source and target warehouses must be different');
                }
                return true;
            }),
        body('productId').isUUID().withMessage('Valid product ID required'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('reason').optional().isString().trim(),
        body('notes').optional().isString().trim()
    ],

    adjustStock: [
        body('warehouseId').isUUID().withMessage('Valid warehouse ID required'),
        body('productId').isUUID().withMessage('Valid product ID required'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
        body('adjustmentType').isIn(['INCREMENT', 'DECREMENT'])
            .withMessage('Adjustment type must be INCREMENT or DECREMENT'),
        body('reason').isString().trim().notEmpty().withMessage('Reason is required'),
        body('notes').optional().isString().trim()
    ],

    createStockCount: [
        body('warehouseId').isUUID().withMessage('Valid warehouse ID required'),
        body('zoneId').optional().isUUID().withMessage('Valid zone ID required'),
        body('scheduledDate').isISO8601().withMessage('Valid scheduled date required'),
        body('notes').optional().isString().trim()
    ]
};

module.exports = { inventoryValidation };
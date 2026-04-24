const { body, query, param } = require('express-validator');


class ProductValidation {
    createProductValidation() {
        return [
            body('name').notEmpty().withMessage('Product name is required'),
            body('price').notEmpty().isNumeric().withMessage('Product price is required and must be a number'),
            body('category_id').optional({ checkFalsy: true }).isUUID().withMessage('Category ID must be a valid UUID'),
            body('min_stock').optional().isInt({ min: 0 }).withMessage('Min stock must be a non-negative integer'),
            body('sku').optional().isString().withMessage('SKU must be a string'),
            body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be a valid URL'),
        ];
    }

    updateProductValidation() {
        return [
            param('id').notEmpty().isUUID().withMessage('Product ID is required and must be a valid UUID'),
            body('name').optional().isString().withMessage('Product name must be a string'),
            body('price').optional().isNumeric().withMessage('Product price must be a number'),
            body('category_id').optional({ checkFalsy: true }).isUUID().withMessage('Category ID must be a valid UUID'),
            body('min_stock').optional().isInt({ min: 0 }).withMessage('Min stock must be a non-negative integer'),
            body('sku').optional().isString().withMessage('SKU must be a string'),
            body('image_url').optional({ checkFalsy: true }).isURL().withMessage('Image URL must be a valid URL'),
        ];
    }

    deleteProductValidation() {
        return [
            param('id').notEmpty().isUUID().withMessage('Product ID is required and must be a valid UUID'),
        ];
    }

    getProductValidation() {
        return [
            param('id').notEmpty().isUUID().withMessage('Product ID is required and must be a valid UUID'),
        ];
    }

    getAllProductsValidation() {
        return [
            query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
            query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
            query('search').optional().isString().withMessage('Search must be a string'),
            query('category_id').optional({ checkFalsy: true }).isUUID().withMessage('Category ID must be a valid UUID'),
            query('is_active').optional({ checkFalsy: true }).isBoolean().withMessage('is_active must be true or false'),
            query('sort_by').optional().isIn(['name', 'price', 'quantity', 'createdAt', 'updatedAt']).withMessage('sort_by must be one of: name, price, quantity, createdAt, updatedAt'),
            query('sort_order').optional().isIn(['asc', 'desc']).withMessage('sort_order must be asc or desc'),
        ];
    }
}

module.exports = new ProductValidation();
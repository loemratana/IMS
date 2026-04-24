const { body, query, param } = require('express-validator');

class CategoryValidation {
    static create() {
        return [
            body('name')
                .notEmpty().withMessage('Category name is required')
                .isString().withMessage('Category name must be a string')
                .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters')
                .trim(),
            body('description')
                .optional()
                .isString().withMessage('Description must be a string')
                .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
                .trim(),
            body('isActive')
                .optional()
                .isBoolean().withMessage('isActive must be a boolean'),
            body('image')
                .optional()
                .isURL().withMessage('Image must be a valid URL')
                .trim(),
            body('slug')
                .optional()
                .isSlug().withMessage('Slug must be a valid slug format')
                .trim()
        ];
    }

    static update() {
        return [
            param('id').isUUID().withMessage('Invalid Category ID format'),
            body('name')
                .optional()
                .isString().withMessage('Category name must be a string')
                .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters')
                .trim(),
            body('description')
                .optional()
                .isString().withMessage('Description must be a string')
                .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
                .trim(),
            body('isActive')
                .optional()
                .isBoolean().withMessage('isActive must be a boolean'),
            body('image')
                .optional()
                .isURL().withMessage('Image must be a valid URL')
                .trim(),
            body('slug')
                .optional()
                .isSlug().withMessage('Slug must be a valid slug format')
                .trim()
        ];
    }

    static idParam() {
        return [
            param('id').isUUID().withMessage('Invalid Category ID format')
        ];
    }

    static queryFilters() {
        return [
            query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
            query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
            query('search').optional().isString().withMessage('Search must be a string').trim(),
            query('includeInactive').optional().isBoolean().withMessage('includeInactive must be a boolean')
        ];
    }
}

module.exports = CategoryValidation;

const productService = require('../services/productService');
const logger = require('../utils/logger');

class ProductController {
    /**
     * GET /products — Get all products with filters & pagination
     */
    async getAllProducts(req, res, next) {
        try {
            const filters = {
                page: req.query.page,
                limit: req.query.limit,
                search: req.query.search,
                category_id: req.query.category_id,
                supplier_id: req.query.supplier_id,
                is_active: req.query.is_active,
                sort_by: req.query.sort_by,
                sort_order: req.query.sort_order
            };

            const result = await productService.getAllProducts(filters);

            res.json({
                success: true,
                data: result.products,
                pagination: result.pagination,
                summary: result.summary,
                message: 'Products retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /products/:id — Get a product by ID
     */
    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.getProductById(id);

            res.json({
                success: true,
                data: result.product,
                message: 'Product retrieved successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /products — Create a new product
     */
    async createProduct(req, res, next) {
        try {
            const productData = {
                name: req.body.name,
                description: req.body.description,
                category_id: req.body.category_id,
                supplier_id: req.body.supplier_id,
                price: req.body.price,
                min_stock: req.body.min_stock,
                sku: req.body.sku,
                image_url: req.body.image_url
            };

            const result = await productService.createProduct(productData);

            res.status(201).json({
                success: true,
                data: result.product,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /products/:id — Update a product
     */
    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                name: req.body.name,
                description: req.body.description,
                category_id: req.body.category_id,
                supplier_id: req.body.supplier_id,
                price: req.body.price,
                min_stock: req.body.min_stock,
                sku: req.body.sku,
                image_url: req.body.image_url,
                is_active: req.body.is_active
            };

            const result = await productService.updateProduct(id, updateData);

            res.json({
                success: true,
                data: result.product,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /products/:id — Soft-delete a product
     */
    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.deleteProduct(id);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();
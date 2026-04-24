const inventoryService = require('../services/inventoryService');
class InventoryController {

    async stockIn(req, res, next) {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not found in request'
                });
            }

            const result = await inventoryService.stockIn(
                req.body,
                req.user.id
            );

            res.status(201).json({
                success: true,
                data: result.data,
                message: result.message
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    /**
     * Stock OUT - Issue products
     */
    async stockOut(req, res, next) {
        try {
            const result = await inventoryService.stockOut(req.body, req.user.id);

            res.status(201).json({
                success: true,
                data: result.data,
                message: result.message
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async transferStock(req, res, next) {
        try {
            const result = await inventoryService.transferStock(req.body, req.user.id);

            res.json({
                success: true,
                data: result.data,
                message: result.message
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getCurrentStock(req, res, next) {
        try {
            const result = await inventoryService.getCurrentStock(req.query);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    handleError(error, res, next) {
        const errorMap = {
            'PRODUCT_NOT_FOUND': { status: 404, message: 'Product not found' },
            'WAREHOUSE_NOT_FOUND': { status: 404, message: 'Warehouse not found' },
            'STOCK_NOT_FOUND': { status: 404, message: 'No stock record found for this product/warehouse' },
            'INSUFFICIENT_STOCK': { status: 400, message: 'Insufficient stock quantity' },
            'SOURCE_STOCK_NOT_FOUND': { status: 404, message: 'Source warehouse has no stock for this product' },
            'SAME_WAREHOUSE_TRANSFER': { status: 400, message: 'Source and destination warehouse must be different' },
        };

        const mapped = errorMap[error.message];
        if (mapped) {
            return res.status(mapped.status).json({ success: false, message: mapped.message });
        }
        next(error);
    }


}

module.exports = new InventoryController();
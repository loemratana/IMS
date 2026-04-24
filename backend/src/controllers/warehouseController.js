const warehouseService = require('../services/warehouseService');
const logger = require('../utils/logger');

class WarehouseController {
    async createWarehouse(req, res, next) {
        try {
            const warehouse = await warehouseService.createWarehouse(req.body);
            res.status(201).json({
                success: true,
                message: 'Warehouse created successfully',
                data: warehouse
            });
        } catch (error) {
            logger.error('Error creating warehouse:', error);
            next(error);
        }
    }

    async getAllWarehouses(req, res, next) {
        try {
            const result = await warehouseService.getAllWarehouses(req.query);
            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error('Error getting warehouses:', error);
            next(error);
        }
    }

    async getWarehouseById(req, res, next) {
        try {
            const warehouse = await warehouseService.getWarehouseById(req.params.id);
            res.status(200).json({
                success: true,
                data: warehouse
            });
        } catch (error) {
            logger.error('Error getting warehouse detail:', error);
            next(error);
        }
    }

    async updateWarehouse(req, res, next) {
        try {
            const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Warehouse updated successfully',
                data: warehouse
            });
        } catch (error) {
            logger.error('Error updating warehouse:', error);
            next(error);
        }
    }

    async deleteWarehouse(req, res, next) {
        try {
            await warehouseService.deleteWarehouse(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Warehouse deleted successfully'
            });
        } catch (error) {
            logger.error('Error deleting warehouse:', error);
            next(error);
        }
    }
}

module.exports = new WarehouseController();
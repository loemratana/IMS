const purchaseService = require('../services/purchaseService');
class PurchaseController {
    constructor() {
        this.createPurchaseOrder = this.createPurchaseOrder.bind(this);
        this.approvePurchaseOrder = this.approvePurchaseOrder.bind(this);
        this.getAllPurchaseOrders = this.getAllPurchaseOrders.bind(this);
        this.getPurchaseOrderById = this.getPurchaseOrderById.bind(this);
        this.receivePurchaseOrderItems = this.receivePurchaseOrderItems.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    /**
     * Create Purchase Order (PENDING)
     */
    async createPurchaseOrder(req, res, next) {
        try {
            const result = await purchaseService.createPurchaseOrder(req.body, req.user.id);

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
     * Approve Purchase Order (APPROVED + Stock Update)
     */
    async approvePurchaseOrder(req, res, next) {
        try {
            const { id } = req.params;
            const { notes } = req.body || {};

            const result = await purchaseService.approvePurchaseOrder(id, req.user.id, notes);

            res.json({
                success: true,
                data: result.data,
                message: result.message
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getAllPurchaseOrders(req, res, next) {
        try {
            const { status, supplierId, search, page, limit } = req.query;
            const result = await purchaseService.getAllPurchaseOrders({
                status,
                supplierId,
                search,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20
            });

            res.json({
                success: true,
                data: result.orders,
                pagination: result.pagination
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getPurchaseOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await purchaseService.getPurchaseOrderById(id);

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async receivePurchaseOrderItems(req, res, next) {
        try {
            const { id } = req.params;
            const { items } = req.body; // items: [{ itemId, quantity }]

            const result = await purchaseService.receivePurchaseOrderItems(id, req.user.id, items);

            res.json({
                success: true,
                data: result.data,
                message: result.message
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    handleError(error, res, next) {
        const errorMap = {
            'PURCHASE_NOT_FOUND': { status: 404, message: 'Purchase order not found' },
            'ALREADY_APPROVED': { status: 400, message: 'Purchase order is already approved' },
            'ALREADY_REJECTED': { status: 400, message: 'Purchase order is already rejected' },
            'INSUFFICIENT_STOCK': { status: 400, message: 'Insufficient stock for this operation' }
        };

        const mapped = errorMap[error.message];

        if (mapped) {
            res.status(mapped.status).json({
                success: false,
                error: {
                    code: error.message,
                    message: mapped.message
                }
            });
        } else {
            next(error);
        }
    }
}

module.exports = new PurchaseController();
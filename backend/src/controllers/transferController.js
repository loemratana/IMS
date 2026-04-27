const transferService = require('../services/transferService');


class TransferController {
    constructor() {
        this.getAllTransfers = this.getAllTransfers.bind(this);
        this.createTransferRequest = this.createTransferRequest.bind(this);
        this.approveTransferRequest = this.approveTransferRequest.bind(this);
        this.executeTransfer = this.executeTransfer.bind(this);
        this.getTransferRequestById = this.getTransferRequestById.bind(this);
        this.cancelTransferRequest = this.cancelTransferRequest.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    async getAllTransfers(req, res, next) {
        try {
            const result = await transferService.getAllTransfers(req.query);
            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }


    async createTransferRequest(req, res, next) {

        try {
            const result = await transferService.createTransferRequest(req.body, req.user.id);

            return res.status(201).json({
                success: true,
                data: result,
                message: 'Transfer request created successfully'
            });
        }
        catch (error) {
            this.handleError(error, res, next);
        }

    }

    async approveTransferRequest(req, res, next) {
        try {
            const result = await transferService.approveTransferRequest(req.params.id, req.user.id, req.body.approvalNotes);
            res.json(result);
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async executeTransfer(req, res, next) {
        try {
            const result = await transferService.executeTransfer(req.params.id, req.user.id, req.body.executionNotes);
            res.json(result);
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async cancelTransferRequest(req, res, next) {
        try {
            const result = await transferService.cancelTransferRequest(req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getTransferRequestById(req, res, next) {
        try {
            const result = await transferService.getTransferRequestById(req.params.id, req.user.id);
            res.json(result);
        } catch (error) {
            this.handleError(error, res, next);
        }
    }



    handleError(error, res, next) {
        const errorMap = {
            'SOURCE_WAREHOUSE_NOT_FOUND': { status: 404, message: 'Source warehouse not found' },
            'SOURCE_WAREHOUSE_INACTIVE': { status: 400, message: 'Source warehouse is inactive' },
            'TARGET_WAREHOUSE_NOT_FOUND': { status: 404, message: 'Target warehouse not found' },
            'TARGET_WAREHOUSE_INACTIVE': { status: 400, message: 'Target warehouse is inactive' },
            'SAME_WAREHOUSE_TRANSFER': { status: 400, message: 'Source and target warehouses must be different' },
            'PRODUCT_NOT_FOUND': { status: 404, message: 'Product not found' },
            'PRODUCT_INACTIVE': { status: 400, message: 'Product is inactive' },
            'INVALID_QUANTITY': { status: 400, message: 'Quantity must be greater than 0' },
            'SOURCE_STOCK_NOT_FOUND': { status: 404, message: 'No stock record found for this product in source warehouse' },
            'INSUFFICIENT_STOCK': { status: 409, message: 'Insufficient stock available' },
            'TRANSFER_REQUEST_NOT_FOUND': { status: 404, message: 'Transfer request not found' },
            'RESERVATION_NOT_VALID': { status: 400, message: 'Stock reservation is not valid' },
            'RESERVATION_EXPIRED': { status: 409, message: 'Stock reservation has expired' },
            'INSUFFICIENT_STOCK_FOR_EXECUTION': { status: 409, message: 'Insufficient stock for execution' }
        };
        const mappedError = errorMap[error.message];
        if (mappedError) {
            return res.status(mappedError.status).json({
                success: false,
                message: mappedError.message
            });
        }
        next(error);
    }
}

module.exports = new TransferController();
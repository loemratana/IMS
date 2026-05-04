const supplierService = require('../services/supplierService');
class SupplierController {
    constructor() {
        this.createSupplier = this.createSupplier.bind(this);
        this.getAllSuppliers = this.getAllSuppliers.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    /**
     * Create supplier
     */
    async createSupplier(req, res, next) {
        try {
            const supplier = await supplierService.createSupplier(req.body, req.user.id);

            res.status(201).json({
                success: true,
                data: supplier,
                message: 'Supplier created successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    /**
     * Get all suppliers
     */
    async getAllSuppliers(req, res, next) {
        try {
            const result = await supplierService.getAllSuppliers(req.query);

            res.json({
                success: true,
                data: result.suppliers,
                pagination: result.pagination
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getSupplierById(req, res, next) {
        try {
            const supplier = await supplierService.getSupplierById(req.params.id);
            res.json({
                success: true,
                data: supplier
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    /**
   * Update supplier
   */
    async updateSupplier(req, res, next) {
        try {
            const supplier = await supplierService.updateSupplier(req.params.id, req.body, req.user.id);

            res.json({
                success: true,
                data: supplier,
                message: 'Supplier updated successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    /**
     * Delete supplier (soft delete)
     */
    async deleteSupplier(req, res, next) {
        try {
            const supplier = await supplierService.deleteSupplier(req.params.id, req.user.id);

            res.json({
                success: true,
                data: supplier,
                message: 'Supplier deactivated successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    /**
     * Hard delete supplier
     */
    async hardDeleteSupplier(req, res, next) {
        try {
            await supplierService.hardDeleteSupplier(req.params.id, req.user.id);

            res.json({
                success: true,
                message: 'Supplier permanently deleted'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    handleError(error, res, next) {
        const errorMap = {
            'SUPPLIER_NAME_REQUIRED': { status: 400, message: 'Supplier name is required' },
            'SUPPLIER_EMAIL_EXISTS': { status: 409, message: 'Supplier with this email already exists' },
            'SUPPLIER_NOT_FOUND': { status: 404, message: 'Supplier not found' }
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

module.exports = new SupplierController();

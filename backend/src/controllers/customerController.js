const customerService = require('../services/customerService');

class CustomerController {
    constructor() {
        this.createCustomer = this.createCustomer.bind(this);
        this.getAllCustomers = this.getAllCustomers.bind(this);
        this.getCustomerById = this.getCustomerById.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.bulkDeleteCustomers = this.bulkDeleteCustomers.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    async createCustomer(req, res, next) {
        try {
            const customer = await customerService.createCustomer(req.body, req.user.id);

            res.status(201).json({
                success: true,
                data: customer,
                message: 'Customer created successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getAllCustomers(req, res, next) {
        try {
            const customers = await customerService.getAllCustomers(req.query);
            res.status(200).json({
                success: true,
                data: customers,
                message: 'Customers retrieved successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async getCustomerById(req, res, next) {
        try {
            const customer = await customerService.getCustomerById(req.params.id);
            res.status(200).json({
                success: true,
                data: customer
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async updateCustomer(req, res, next) {
        try {
            const customer = await customerService.updateCustomer(req.params.id, req.body, req.user.id);
            res.status(200).json({
                success: true,
                data: customer,
                message: 'Customer updated successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async deleteCustomer(req, res, next) {
        try {
            await customerService.deleteCustomer(req.params.id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Customer deleted successfully'
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    async bulkDeleteCustomers(req, res, next) {
        try {
            const result = await customerService.bulkDeleteCustomers(req.body.ids, req.user.id);
            res.status(200).json({
                success: true,
                data: result,
                message: `${result.count} customers deleted successfully`
            });
        } catch (error) {
            this.handleError(error, res, next);
        }
    }

    handleError(error, res, next) {
        const errorMap = {
            'CUSTOMER_NAME_REQUIRED': { status: 400, message: 'Customer name is required' },
            'CUSTOMER_EMAIL_EXISTS': { status: 409, message: 'Customer with this email already exists' },
            'CUSTOMER_PHONE_EXISTS': { status: 409, message: 'Customer with this phone number already exists' },
            'CUSTOMER_NOT_FOUND': { status: 404, message: 'Customer not found' },
            'CUSTOMER_HAS_SALES': { status: 400, message: 'Cannot delete customer with existing sales records' }
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

module.exports = new CustomerController();
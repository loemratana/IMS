const prisma = require('../config/database');
const logger = require('../utils/logger');
const generateCustomerCode = require('../utils/generateCustomerCode');

class CustomerService {

    async createCustomer(data, userId) {
        try {
            const { name, email, phone, address, type, notes } = data;

            if (!name) {
                throw new Error("CUSTOMER_NAME_REQUIRED");
            }

            if (email) {
                const existingEmail = await prisma.customer.findUnique({
                    where: { email },
                });

                if (existingEmail) {
                    throw new Error("CUSTOMER_EMAIL_EXISTS");
                }
            }

            if (phone) {
                const existingPhone = await prisma.customer.findUnique({
                    where: { phone },
                });

                if (existingPhone) {
                    throw new Error("CUSTOMER_PHONE_EXISTS");
                }
            }

            // Generate customer code
            const code = await generateCustomerCode();

            const customer = await prisma.customer.create({
                data: {
                    code,
                    name,
                    email,
                    phone,
                    address,
                    type: type || 'RETAIL',
                    status: 'ACTIVE',
                    notes
                }
            });

            logger.info(`Customer created: ${customer.code} - ${customer.name} by user ${userId}`);

            return customer;
        }
        catch (err) {
            logger.error("Error creating customer:", err);
            throw err;
        }
    }

    /**
   * Get all customers with filters
   */
    async getAllCustomers(filters = {}) {
        const { page = 1,
            limit = 20,
            search,
            type,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc' } = filters;

        try {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const take = parseInt(limit);
            const where = {};

            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (type) {
                where.type = type;
            }
            if (status) {
                where.status = status;
            }

            const orderBy = {};
            orderBy[sortBy] = sortOrder;

            const [customers, total] = await Promise.all([
                prisma.customer.findMany({
                    where,
                    orderBy,
                    skip,
                    take
                }),
                prisma.customer.count({ where })
            ]);

            const totalPages = Math.ceil(total / take);

            return {
                data: customers,
                meta: {
                    page: parseInt(page),
                    limit: take,
                    total,
                    totalPages,
                }
            };

        } catch (error) {
            logger.error("Error getting customers:", error);
            throw error;
        }
    }

    /**
     * Get customer by ID
     */
    async getCustomerById(id) {
        try {
            const customer = await prisma.customer.findUnique({
                where: { id },

            });

            if (!customer) {
                throw new Error("CUSTOMER_NOT_FOUND");
            }

            return customer;
        } catch (error) {
            logger.error(`Error getting customer ${id}:`, error);
            throw error;
        }
    }

    async getCustomerByCode(code) {
        try {

            const code = await prisma.customer.findUnique({
                where: { code }
            });

            if (!code) {
                throw new Error("CUSTOMER_NOT_FOUND");
            }

            return code;

        }
        catch (error) {
            logger.error(`Error getting customer ${code}:`, error);
            throw error;
        }
    }

    /**
     * Update customer
     */
    async updateCustomer(id, data, userId) {
        try {
            const { name, email, phone, address, type, status, notes } = data;

            // Check if customer exists
            const existingCustomer = await prisma.customer.findUnique({
                where: { id }
            });

            if (!existingCustomer) {
                throw new Error("CUSTOMER_NOT_FOUND");
            }

            // Check if email already exists for other customer
            if (email && email !== existingCustomer.email) {
                const emailInUse = await prisma.customer.findUnique({
                    where: { email }
                });
                if (emailInUse) {
                    throw new Error("CUSTOMER_EMAIL_EXISTS");
                }
            }

            // Check if phone already exists for other customer
            if (phone && phone !== existingCustomer.phone) {
                const phoneInUse = await prisma.customer.findUnique({
                    where: { phone }
                });
                if (phoneInUse) {
                    throw new Error("CUSTOMER_PHONE_EXISTS");
                }
            }

            const customer = await prisma.customer.update({
                where: { id },
                data: {
                    name,
                    email,
                    phone,
                    address,
                    type,
                    status,
                    notes
                }
            });

            logger.info(`Customer updated: ${customer.code} by user ${userId}`);

            return customer;
        } catch (error) {
            logger.error(`Error updating customer ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete customer
     */
    async deleteCustomer(id, userId) {
        try {
            const customer = await prisma.customer.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { sales: true }
                    }
                }
            });

            if (!customer) {
                throw new Error("CUSTOMER_NOT_FOUND");
            }

            // Prevent deletion if customer has sales records
            if (customer._count.sales > 0) {
                throw new Error("CUSTOMER_HAS_SALES");
            }

            await prisma.customer.delete({
                where: { id }
            });

            logger.info(`Customer deleted: ${customer.code} by user ${userId}`);

            return { id };
        } catch (error) {
            logger.error(`Error deleting customer ${id}:`, error);
            throw error;
        }
    }

    /**
     * Bulk delete customers
     */
    async bulkDeleteCustomers(ids, userId) {
        try {
            // Only delete customers without sales records
            const customersWithSales = await prisma.customer.findMany({
                where: {
                    id: { in: ids },
                    sales: { some: {} }
                },
                select: { id: true, name: true }
            });

            if (customersWithSales.length > 0) {
                const names = customersWithSales.map(c => c.name).join(', ');
                throw new Error(`Cannot delete customers with sales records: ${names}`);
            }

            const { count } = await prisma.customer.deleteMany({
                where: {
                    id: { in: ids }
                }
            });

            logger.info(`Bulk deleted ${count} customers by user ${userId}`);

            return { count };
        } catch (error) {
            logger.error("Error bulk deleting customers:", error);
            throw error;
        }
    }
}

module.exports = new CustomerService();
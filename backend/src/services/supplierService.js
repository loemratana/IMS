
const prisma = require('../config/database');
const logger = require('../utils/logger');

class supplierService {
    /**
   * Generate supplier code
   */
    async generateSupplierCode() {
        const count = await prisma.supplier.count();
        const year = new Date().getFullYear();
        return `SUPP-${year}-${String(count + 1).padStart(5, '0')}`;
    }


    /**
     * Create new supplier
     */
    async createSupplier(data, userId) {
        const { name, email, phone, address, type, notes } = data;

        // Validate required fields
        if (!name) {
            throw new Error('SUPPLIER_NAME_REQUIRED');
        }

        // Check if supplier with same email exists
        if (email) {
            const existing = await prisma.supplier.findFirst({
                where: { email }
            });
            if (existing) {
                throw new Error('SUPPLIER_EMAIL_EXISTS');
            }
        }

        // Generate supplier code
        const code = await this.generateSupplierCode();

        const supplier = await prisma.supplier.create({
            data: {
                code,
                name,
                email,
                phone,
                address,
                type: type || 'REGULAR',
                status: 'ACTIVE',
                notes
            }
        });

        logger.info(`Supplier created: ${supplier.code} - ${supplier.name} by user ${userId}`);

        return supplier;
    }


    /**
     * Get all suppliers with filters
     */
    async getAllSuppliers(filters = {}) {
        const {
            page = 1,
            limit = 20,
            search,
            type,
            status,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = filters;

        const skip = (page - 1) * limit;
        const where = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (type) where.type = type;
        if (status) where.status = status;

        const orderBy = {};
        orderBy[sortBy] = sortOrder;

        const [suppliers, total] = await Promise.all([
            prisma.supplier.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy
            }),
            prisma.supplier.count({ where })
        ]);

        return {
            suppliers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
   * Get supplier by ID
   */
    async getSupplierById(id) {
        const supplier = await prisma.supplier.findUnique({
            where: { id }
        })

        if (!supplier) {
            throw new Error('SUPPLIER_NOT_FOUND');
        }

        return supplier;
    }

    /**
      * Get supplier by code
      */

    async getSupplierByCode(code) {
        const supplier = await prisma.supplier.findUnique({
            where: { code }
        })

        if (!supplier) {
            throw new Error('SUPPLIER_NOT_FOUND');
        }

        return supplier;
    }
    /**
   * Update supplier
   */

    async updateSupplier(id, data, userId) {
        const supplier = await prisma.supplier.update({
            where: { id }
        });
        if (!supplier) {
            throw new Error('SUPPLIER_NOT_FOUND');
        }

        // Check email uniqueness if changing

        if (data.email && data.email !== supplier.email) {
            const existing = await prisma.supplier.findFirst({
                where: {
                    email: data.email,
                    id: {
                        not: id
                    }
                }
            });
            if (existing) {
                throw new Error('SUPPLIER_EMAIL_EXISTS');
            }
        }

        const updated = await prisma.supplier.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                type: data.type,
                status: data.status,
                notes: data.notes
            }
        });

        logger.info(`Supplier updated: ${updated.code} - ${updated.name} by user ${userId}`);

        return updated;

    }


    /**
     * Delete supplier (soft delete)
     */

    async deleteSupplier(id, userId) {

        const supplier = await prisma.supplier.update({
            where: { id },
        });
        if (!supplier) {
            throw new Error('SUPPLIER_NOT_FOUND');
        }

        const deleted = await prisma.supplier.update({
            where: { id },
            data: { status: 'INACTIVE' }

        });
        logger.info(`Supplier deactivated: ${deleted.code} - ${deleted.name} by user ${userId}`);
        return deleted;

    }

    /**
 * Hard delete supplier (admin only)
 */
    async hardDeleteSupplier(id, userId) {
        const supplier = await prisma.supplier.findUnique({
            where: { id }
        })
        if (!supplier) {
            throw new Error('SUPPLIER_NOT_FOUND');
        }
        const deleted = await prisma.supplier.delete({
            where: { id }
        });
        logger.info(`Supplier deleted: ${deleted.code} - ${deleted.name} by user ${userId}`);
        return { success: true };

    }


}

module.exports = new supplierService();

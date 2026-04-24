const prisma = require('../config/database');
const logger = require('../utils/logger');

class WarehouseService {
    async createWarehouse(data) {
        const { name, code, location, address, contactPerson, phone, capacity, description } = data;

        if (code) {
            const existingWarehouse = await prisma.warehouse.findUnique({
                where: { code },
            });

            if (existingWarehouse) {
                throw new Error('Warehouse code already exists');
            }
        }

        const warehouse = await prisma.warehouse.create({
            data: {
                name,
                code,
                location,
                address,
                contactPerson,
                phone,
                capacity: capacity ? parseInt(capacity) : null,
                minStock: data.minStock ? parseInt(data.minStock) : null,
                maxStock: data.maxStock ? parseInt(data.maxStock) : null,
                description,
                isActive: true
            }
        });

        logger.info(`Warehouse created successfully: ${warehouse.name}`);
        return warehouse;
    }

    async getAllWarehouses(filters = {}) {
        const { page = 1, limit = 10, search, location, isActive } = filters;

        const skip = (page - 1) * limit;
        const where = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        const [warehouses, total] = await Promise.all([
            prisma.warehouse.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            stockItems: true
                        }
                    }
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.warehouse.count({ where })
        ]);

        // Add summary info for each warehouse
        const warehousesWithDetails = await Promise.all(
            warehouses.map(async (w) => {
                const stockItems = await prisma.stock.findMany({
                    where: { warehouseId: w.id },
                    include: {
                        product: {
                            select: { price: true }
                        }
                    }
                });

                const totalItems = stockItems.reduce((acc, curr) => acc + curr.quantity, 0);
                const totalValue = stockItems.reduce((acc, curr) => acc + (curr.quantity * (curr.product?.price || 0)), 0);
                const capacityUsage = w.capacity ? Math.round((totalItems / w.capacity) * 100) : 0;

                return {
                    ...w,
                    stockCount: totalItems,
                    totalStockValue: totalValue,
                    capacityUsage: capacityUsage > 100 ? 100 : capacityUsage
                };
            })
        );

        return {
            data: warehousesWithDetails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getWarehouseById(id) {
        const warehouse = await prisma.warehouse.findUnique({
            where: { id },
            include: {
                stockItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!warehouse) {
            throw new Error('Warehouse not found');
        }

        return warehouse;
    }

    async updateWarehouse(id, data) {

        try {
            const warehouse = await prisma.warehouse.findUnique({
                where: { id }
            });

            if (!warehouse) {

                throw new Error('Warehouse not found');
            }
            // Check code uniqueness if changing

            if (data.code && data.code !== warehouse.code) {
                const existingWarehouse = await prisma.warehouse.findUnique({
                    where: { code: data.code }
                });
                if (existingWarehouse) {
                    throw new Error('Warehouse code already exists');
                }
            }


            const updatedWarehouse = await prisma.warehouse.update({
                where: { id },
                data: {
                    name: data.name,
                    code: data.code,
                    location: data.location,
                    address: data.address,
                    contactPerson: data.contactPerson,
                    phone: data.phone,
                    capacity: data.capacity ? parseInt(data.capacity) : undefined,
                    minStock: data.minStock ? parseInt(data.minStock) : undefined,
                    maxStock: data.maxStock ? parseInt(data.maxStock) : undefined,
                    description: data.description,
                    isActive: data.isActive
                }
            })
            logger.info(`Warehouse updated: ${updatedWarehouse.name}`);
            return updatedWarehouse;

        }

        catch (error) {
            logger.error(`Error updating warehouse: ${error.message}`);
            throw error;
        }

    }

    async deleteWarehouse(id) {
        // Check if warehouse has stock
        const stockCount = await prisma.stock.count({
            where: { warehouseId: id }
        });

        if (stockCount > 0) {
            throw new Error('Cannot delete warehouse with existing stock. Please transfer stock first.');
        }

        await prisma.warehouse.delete({
            where: { id }
        });

        logger.info(`Warehouse deleted: ${id}`);
        return { success: true };
    }


    //get alert lower Stock
    async getLowStockAlerts(warehouseId) {
        const lowStockItems = await prisma.stock.findMany({
            where: {
                warehouseId: warehouseId,
                quantity: { lte: prisma.stock.fields.minStock }

            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                        image: true,
                    }
                }
            },
            orderBy: { quantity: 'asc' }
        });
        return lowStockItems.map(item => ({
            ...item,
            alertLevel: this.getAlertLevel(item.quantity, item.minStock),
            recommendedOrder: Math.max(0, item.minStock * 2 - item.quantity)
        }));
    }
    async getWarehouseById(id) {
        const warehouse = await prisma.warehouse.findUnique({
            where: {
                id: id
            },
            include: {
                stockItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                price: true,
                            }
                        }
                    },
                    take: 50,
                    orderBy: {
                        quantity: 'asc'
                    },
                    movements: {
                        take: 10,
                        orderBy: {
                            createdAt: 'desc'
                        },
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    sku: true,
                                    price: true,
                                }
                            }
                        }

                    }

                }
            }
        });
        if (!warehouse) {
            throw new Error('Warehouse not found');
        }
        return warehouse;
    }
}

module.exports = new WarehouseService();
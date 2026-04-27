const { Prisma } = require('@prisma/client');
const prisma = require('../config/database');
const logger = require('../utils/logger');

class InventoryService {
    /**
     * Stock IN - Receive products into warehouse
     */
    async stockIn(data, userId) {
        const {
            warehouseId,
            productId,
            quantity,
            reason,
            referenceNo,
            purchaseOrderNo,
            supplierId,
            batchNo,
            expiryDate,
            unitCost,
            notes
        } = data;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Validate product
            const product = await tx.product.findUnique({
                where: { id: productId }
            });
            if (!product) throw new Error('PRODUCT_NOT_FOUND');

            // 2. Validate warehouse
            const warehouse = await tx.warehouse.findUnique({
                where: { id: warehouseId }
            });
            if (!warehouse) throw new Error('WAREHOUSE_NOT_FOUND');

            // 3. Update stock
            let stock = await tx.stock.findUnique({
                where: { productId_warehouseId: { productId, warehouseId } }
            });

            const oldQuantity = stock?.quantity || 0;
            const newQuantity = oldQuantity + quantity;

            if (stock) {
                stock = await tx.stock.update({
                    where: { id: stock.id },
                    data: {
                        quantity: newQuantity
                    }
                });
            } else {
                stock = await tx.stock.create({
                    data: {
                        warehouseId,
                        productId,
                        quantity: quantity,
                        minStock: product.minStockLevel || 5,
                        maxStock: 1000 // Default max
                    }
                });
            }

            // 4. Record stock movement
            const movement = await tx.stockMovement.create({
                data: {
                    warehouseId,
                    productId,
                    type: 'IN',
                    quantity: quantity,
                    reason: reason || `Stock IN - PO: ${purchaseOrderNo || 'N/A'}`,
                    createdBy: userId,
                }
            });

            // 5. Add audit log
            await tx.auditLog.create({
                data: {
                    action: 'STOCK_IN',
                    userId,
                    newValue: JSON.stringify({ productId, warehouseId, quantity, reason })
                }
            });

            return { stock, movement };
        });

        logger.info(`Stock IN: ${quantity} units of product ${productId} to warehouse ${warehouseId} by user ${userId}`);

        return {
            success: true,
            data: result,
            message: 'Stock received successfully'
        };
    }

    /**
     * Stock OUT - Issue products from warehouse
     */
    async stockOut(data, userId) {
        const {
            productId,
            warehouseId,
            quantity,
            referenceNo,
            customerId,
            salesOrderNo,
            reason,
            notes
        } = data;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Validate product
            const product = await tx.product.findUnique({
                where: { id: productId }
            });
            if (!product) throw new Error('PRODUCT_NOT_FOUND');

            // 2. Validate warehouse
            const warehouse = await tx.warehouse.findUnique({
                where: { id: warehouseId }
            });
            if (!warehouse) throw new Error('WAREHOUSE_NOT_FOUND');

            // 3. Check stock availability
            const stock = await tx.stock.findUnique({
                where: { productId_warehouseId: { productId, warehouseId } }
            });

            if (!stock) throw new Error('STOCK_NOT_FOUND');
            if (stock.quantity < quantity) throw new Error('INSUFFICIENT_STOCK');

            const oldQuantity = stock.quantity;
            const newQuantity = oldQuantity - quantity;

            // 4. Update stock
            const updatedStock = await tx.stock.update({
                where: { id: stock.id },
                data: {
                    quantity: newQuantity
                }
            });

            // 5. Record stock movement
            const movement = await tx.stockMovement.create({
                data: {
                    warehouseId,
                    productId,
                    type: 'OUT',
                    quantity: quantity,
                    reason: reason || `Stock OUT - ${salesOrderNo || 'N/A'}`,
                    createdBy: userId,
                }
            });

            // 6. Add audit log
            await tx.auditLog.create({
                data: {
                    action: 'STOCK_OUT',
                    userId,
                    oldValue: JSON.stringify({ productId, warehouseId, quantity, reason })
                }
            });

            return { stock: updatedStock, movement };
        });

        logger.info(`Stock OUT: ${quantity} units of product ${productId} from warehouse ${warehouseId} by user ${userId}`);

        return {
            success: true,
            data: result,
            message: 'Stock issued successfully'
        };
    }

    /**
     * Transfer stock between warehouses
     */
    async transferStock(data, userId) {
        const {
            fromWarehouseId,
            toWarehouseId,
            productId,
            quantity,
            reason,
            notes
        } = data;

        if (fromWarehouseId === toWarehouseId) {
            throw new Error('SAME_WAREHOUSE_TRANSFER');
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Validate source stock
            const sourceStock = await tx.stock.findUnique({
                where: { productId_warehouseId: { productId, warehouseId: fromWarehouseId } }
            });

            if (!sourceStock) throw new Error('SOURCE_STOCK_NOT_FOUND');
            if (sourceStock.quantity < quantity) throw new Error('INSUFFICIENT_STOCK');

            // 2. Update source warehouse (OUT)
            const updatedSource = await tx.stock.update({
                where: { id: sourceStock.id },
                data: {
                    quantity: sourceStock.quantity - quantity
                }
            });

            // 3. Update target stock (IN)
            const targetStock = await tx.stock.findUnique({
                where: { productId_warehouseId: { productId, warehouseId: toWarehouseId } }
            });

            let updatedTarget;
            if (targetStock) {
                updatedTarget = await tx.stock.update({
                    where: { id: targetStock.id },
                    data: {
                        quantity: targetStock.quantity + quantity
                    }
                });
            } else {
                updatedTarget = await tx.stock.create({
                    data: {
                        warehouseId: toWarehouseId,
                        productId,
                        quantity: quantity,
                        minStock: sourceStock.minStock || 5,
                        maxStock: sourceStock.maxStock || 1000
                    }
                });
            }

            // 4. Record stock movements
            await tx.stockMovement.create({
                data: {
                    warehouseId: fromWarehouseId,
                    productId,
                    type: 'TRANSFER',
                    quantity: -quantity,
                    reason: reason || 'Stock Transfer OUT',
                    createdBy: userId,
                }
            });

            await tx.stockMovement.create({
                data: {
                    warehouseId: toWarehouseId,
                    productId,
                    type: 'TRANSFER',
                    quantity: quantity,
                    reason: reason || 'Stock Transfer IN',
                    createdBy: userId,
                }
            });

            // 5. Add audit log
            await tx.auditLog.create({
                data: {
                    action: 'STOCK_TRANSFER',
                    userId,
                    newValue: JSON.stringify({ productId, fromWarehouseId, toWarehouseId, quantity })
                }
            });

            return { sourceStock: updatedSource, targetStock: updatedTarget };
        });

        logger.info(`Stock transferred: ${quantity} units of product ${productId} from ${fromWarehouseId} to ${toWarehouseId} by ${userId}`);

        return {
            success: true,
            data: result,
            message: 'Stock transferred successfully'
        };
    }

    /**
  * Adjust stock (increase or decrease)
  */
    async adjustStock(data, userId) {
        const {
            warehouseId,
            productId,
            quantity,
            adjustmentType, // 'INCREMENT' or 'DECREMENT'
            reason,
            notes
        } = data;


        const result = await prisma.$transaction(async (tx) => {
            //1.validate  product and warehouse
            const product = await tx.product.findUnique({ where: { id: productId } });
            if (!product) throw new Error('PRODUCT_NOT_FOUND');

            const warehouse = await tx.warehouse.findUnique({
                where: { id: warehouseId }
            });
            if (!warehouse) throw new Error('WAREHOUSE_NOT_FOUND');

            // 2. Get current stock

            let stock = await tx.stock.findUnique({
                where: { productId_warehouseId: { productId, warehouseId } }
            });

            const oldQuantity = stock ? stock.quantity : 0;
            let newQuantity;

            if (adjustmentType === 'INCREMENT') {
                newQuantity = oldQuantity + Math.abs(quantity);
            }
            else {
                if (oldQuantity < Math.abs(quantity)) {
                    throw new Error('INSUFFICIENT_STOCK_FOR_ADJUSTMENT');
                }
                newQuantity = oldQuantity - Math.abs(quantity);
            }

            // 3. Update or create stock

            if (stock) {
                stock = await tx.stock.update({
                    where: { id: stock.id },
                    data: {
                        quantity: newQuantity,
                        availableQuantity: newQuantity - stock.reservedQuantity,
                        updatedAt: new Date()
                    }
                });
            }
            else {
                if (adjustmentType === 'DECREMENT') {
                    throw new Error('CANNOT_DECREMENT_NONEXISTENT_STOCK');
                }

                stock = await tx.stock.create({
                    data: {
                        warehouseId,
                        productId,
                        quantity: newQuantity,
                        minStock: product.minStock || 5,
                        maxStock: product.maxStock,
                        reorderPoint: product.reorderPoint || 10
                    }
                });
            }
            // 4. Record adjustment movement
            const movement = await tx.stockMovement.create({
                data: {
                    warehouseId,
                    productId,
                    type: 'ADJUST',
                    quantity: adjustmentType === 'INCREMENT' ? Math.abs(quantity) : -Math.abs(quantity),
                    quantityBefore: oldQuantity,
                    quantityAfter: newQuantity,
                    reason: `Stock adjustment: ${reason}`,
                    createdBy: userId
                }
            })

            return { stock, movement };


        });

        logger.info(`Stock adjusted: ${adjustmentType} ${Math.abs(quantity)} units of product ${productId} in warehouse ${warehouseId}`);

        return {
            success: true,
            data: result,
            message: 'Stock adjusted successfully'
        };
    }
    // get current stock levels with filters
    async getCurrentStock(filters = {}) {
        try {
            const {
                productId,
                warehouseId,
                categoryId,
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = filters;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const where = {};

            if (warehouseId) where.warehouseId = warehouseId;
            if (productId) where.productId = productId;
            if (categoryId) {
                where.product = {
                    categoryId: categoryId
                };
            }

            const orderBy = {};
            if (sortBy === 'quantity') {
                orderBy.quantity = sortOrder;
            } else if (sortBy === 'productName') {
                orderBy.product = { name: sortOrder };
            } else if (sortBy === 'warehouseName') {
                orderBy.warehouse = { name: sortOrder };
            } else {
                orderBy.updatedAt = sortOrder;
            }

            const [stockItems, total] = await Promise.all([
                prisma.stock.findMany({
                    where,
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        },
                        warehouse: true
                    },
                    orderBy,
                    skip,
                    take: parseInt(limit)
                }),
                prisma.stock.count({ where })
            ]);

            // Calculate additional metrics
            const stockWithMetrics = stockItems.map(item => ({
                ...item,
                metrics: {
                    totalValue: item.quantity * (item.product.price || 0),
                    stockStatus: this.getStockStatus(item.quantity, item.minStock || 0),
                }
            }));

            const summary = {
                totalProducts: total,
                totalQuantity: stockWithMetrics.reduce((sum, item) => sum + item.quantity, 0),
                lowStockCount: stockWithMetrics.filter(item => item.quantity <= (item.minStock || 0) && item.quantity > 0).length,
                outOfStockCount: stockWithMetrics.filter(item => item.quantity === 0).length
            };

            return {
                data: stockWithMetrics,
                summary,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getCurrentStock:', error);
            throw error;
        }
    }



    getStockStatus(quantity, minStock) {
        if (quantity === 0) return 'OUT_OF_STOCK';
        if (quantity <= minStock) return 'LOW_STOCK';
        return 'IN_STOCK';
    }
}

module.exports = new InventoryService();
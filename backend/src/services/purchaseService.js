
const prisma = require('../config/database');
const logger = require('../utils/logger');


class PurchaseService {

    /**
     * step 1: create Purchase Order (pending)
     * No stock change at this point 
     */

    async createPurchaseOrder(data, userId) {
        const { supplierId, items, expectedDate, notes } = data;
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId }
        });
        if (!supplier) {
            throw new Error("SUPPLIER_NOT_FOUND");
        }
        if (supplier.status !== 'ACTIVE') {
            throw new Error('SUPPLIER_INACTIVE');
        }
        // Validate products and calculate totals
        let totalAmount = 0;
        const validatedItems = [];
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                throw new Error(`PRODUCT_NOT_FOUND: ${item.productId}`);
            }

            // if (!product.isActive) {
            //     throw new Error(`PRODUCT_INACTIVE: ${product.name}`);
            // }

            const itemTotal = item.quantity * item.price;
            totalAmount += itemTotal;
            validatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                totalPrice: itemTotal
            });

        }
        // Generate PO number

        const poNumber = await this.generatePurchaseOrderNo();

        const purchaseOrder = await prisma.$transaction(async (tx) => {
            const purchase = await tx.purchaseOrder.create({
                data: {
                    poNumber,
                    supplierId,
                    totalAmount,
                    status: 'PENDING',
                    expectedDate: expectedDate ? new Date(expectedDate) : null,
                    notes,
                    createdBy: userId
                }
            });

            // Create purchase items
            for (const item of validatedItems) {
                await tx.purchaseItem.create({
                    data: {
                        purchaseId: purchase.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice
                    }
                });
            }

            return purchase;

        });
        logger.info(`Purchase Order created: ${poNumber} by user ${userId}`);

        return {
            success: true,
            data: purchaseOrder,
            message: 'Purchase order created successfully. Awaiting approval.'

        }

    }

    /**
   * STEP 2: Approve Purchase Order
   * This triggers stock update
   */

    async approvePurchaseOrder(purchaseId, userId, notes = null) {

        // Use transaction for atomic operation


        const result = await prisma.$transaction(async (tx) => {

            const purchase = await tx.purchaseOrder.findUnique({
                where: { id: purchaseId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    supplier: true
                }
            });

            if (!purchase) {
                throw new Error('PURCHASE_NOT_FOUND');
            }

            // 2. Validate status transition (PENDING → APPROVED only)
            if (purchase.status !== 'PENDING') {
                throw new Error(`INVALID_STATUS_TRANSITION: Cannot approve purchase with status ${purchase.status}`);
            }

            // 3. Update purchase status to APPROVED
            const updatedPurchase = await tx.purchaseOrder.update({
                where: { id: purchaseId },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                    approvedBy: userId,
                    notes: notes || purchase.notes
                }
            });

            logger.info(`Purchase Order approved: ${purchase.poNumber} by user ${userId}`);

            return {
                purchase: updatedPurchase
            };
        });

        return {
            success: true,
            data: result,
            message: 'Purchase order approved successfully'
        };
    }

    async receivePurchaseOrderItems(id, userId, receivedItems) {
        // receivedItems: [{ itemId, quantity }]
        const result = await prisma.$transaction(async (tx) => {
            const purchase = await tx.purchaseOrder.findUnique({
                where: { id },
                include: { items: { include: { product: true } } }
            });

            if (!purchase) throw new Error('PURCHASE_NOT_FOUND');
            if (purchase.status !== 'APPROVED' && purchase.status !== 'RECEIVING') {
                throw new Error('INVALID_STATUS_FOR_RECEIVING');
            }

            const stockUpdates = [];
            for (const rItem of receivedItems) {
                const poItem = purchase.items.find(i => i.id === rItem.itemId);
                if (!poItem) throw new Error(`ITEM_NOT_FOUND: ${rItem.itemId}`);

                const remaining = poItem.quantity - poItem.receivedQuantity;
                if (rItem.quantity > remaining) {
                    throw new Error(`RECEIVE_QTY_EXCEEDS_PENDING: ${poItem.product.name}`);
                }

                // Update PO Item
                await tx.purchaseItem.update({
                    where: { id: rItem.itemId },
                    data: { receivedQuantity: { increment: rItem.quantity } }
                });

                // Update Product Stock
                const oldStock = poItem.product.stock;
                const newStock = oldStock + rItem.quantity;

                await tx.product.update({
                    where: { id: poItem.productId },
                    data: { stock: newStock }
                });

                // Record stock movement
                await tx.stockMovement.create({
                    data: {
                        productId: poItem.productId,
                        type: 'IN',
                        quantity: rItem.quantity,
                        referenceId: purchase.id,
                        referenceNo: purchase.poNumber,
                        note: `Partial receipt from PO ${purchase.poNumber}`,
                        oldStock,
                        newStock,
                        createdBy: userId
                    }
                });

                stockUpdates.push({
                    productId: poItem.productId,
                    productName: poItem.product.name,
                    received: rItem.quantity,
                    newStock
                });
            }

            // Check if fully received
            const allItems = await tx.purchaseItem.findMany({ where: { purchaseId: id } });
            const isFullyReceived = allItems.every(i => i.receivedQuantity === i.quantity);

            const updatedPurchase = await tx.purchaseOrder.update({
                where: { id },
                data: {
                    status: isFullyReceived ? 'COMPLETED' : 'RECEIVING'
                }
            });

            return { purchase: updatedPurchase, stockUpdates };
        });

        return {
            success: true,
            data: result,
            message: result.purchase.status === 'COMPLETED' ? 'Purchase order fully received' : 'Items received successfully'
        };
    }

    async getAllPurchaseOrders(filters = {}) {
        try {
            const {
                status,
                supplierId,
                search,
                page = 1,
                limit = 20
            } = filters;

            const where = {};
            if (status && status !== 'ALL') where.status = status;
            if (supplierId) where.supplierId = supplierId;
            if (search) {
                where.OR = [
                    { poNumber: { contains: search, mode: 'insensitive' } },
                    { notes: { contains: search, mode: 'insensitive' } }
                ];
            }

            const skip = (page - 1) * limit;

            const [orders, total] = await Promise.all([
                prisma.purchaseOrder.findMany({
                    where,
                    include: {
                        supplier: { select: { name: true } },
                        _count: { select: { items: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.purchaseOrder.count({ where })
            ]);

            return {
                orders: orders.map(o => ({
                    ...o,
                    supplierName: o.supplier.name,
                    itemsCount: o._count.items
                })),
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Error in getAllPurchaseOrders:', error);
            throw error;
        }
    }

    async getPurchaseOrderById(id) {
        try {
            const order = await prisma.purchaseOrder.findUnique({
                where: { id },
                include: {
                    supplier: true,
                    items: {
                        include: {
                            product: { select: { name: true, sku: true } }
                        }
                    }
                }
            });

            if (!order) {
                throw new Error('PURCHASE_NOT_FOUND');
            }

            return order;
        } catch (error) {
            logger.error('Error in getPurchaseOrderById:', error);
            throw error;
        }
    }

    async generatePurchaseOrderNo() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await prisma.purchaseOrder.count({
            where: {
                createdAt: {
                    gte: new Date(year, date.getMonth(), 1),
                    lte: new Date(year, date.getMonth() + 1, 0)
                }
            }
        });
        return `PO-${year}${month}-${String(count + 1).padStart(5, '0')}`;
    }

}

module.exports = new PurchaseService();

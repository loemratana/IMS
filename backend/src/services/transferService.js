const { id } = require('apicache');
const prisma = require('../config/database');
const logger = require('../utils/logger');



// ==================== HELPER METHODS ====================


class TransferService {
    async getAllTransfers(filters = {}) {
        const { status, sourceWarehouseId, targetWarehouseId, productId, search, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const where = {};
        if (status && status !== 'all') where.status = status;
        if (sourceWarehouseId) where.sourceWarehouseId = sourceWarehouseId;
        if (targetWarehouseId) where.targetWarehouseId = targetWarehouseId;
        if (productId) where.productId = productId;

        if (search) {
            where.OR = [
                { requestNumber: { contains: search, mode: 'insensitive' } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
                { product: { sku: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [total, data] = await Promise.all([
            prisma.transferRequest.count({ where }),
            prisma.transferRequest.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { requestedAt: 'desc' },
                include: {
                    sourceWarehouse: true,
                    targetWarehouse: true,
                    product: true,
                    requester: { select: { name: true, email: true } },
                    approver: { select: { name: true } },
                    execution: { include: { executor: { select: { name: true } } } }
                }
            })
        ]);

        return {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            data
        };
    }


    /**
   * STEP 1: Create Transfer Request with Stock Reservation
   * Flow: PENDING + RESERVED
    */

    async createTransferRequest(data, userId) {



        const { sourceWarehouseId,
            targetWarehouseId,
            productId,
            quantity,
            reason,
            priority = 'MEDIUM',
            expectedDeliveryDate,
            notes } = data;




        await this.validateTransferRequest(data, userId);

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {

            const sourceStock = await tx.stock.findUnique({
                where: {
                    productId_warehouseId: {
                        productId,
                        warehouseId: sourceWarehouseId
                    }
                }
            });

            if (!sourceStock) {
                throw new Error('SOURCE_STOCK_NOT_FOUND');
            }
            const availableStock = sourceStock.quantity - sourceStock.reservedQuantity;
            if (availableStock < quantity) {
                throw new Error(`INSUFFICIENT_STOCK.Available:${availableStock},Requested:${quantity}`);
            }

            const requestNumber = await this.generateRequestNumber();

            const transferRequest = await prisma.transferRequest.create({
                data: {
                    requestNumber,
                    sourceWarehouseId,
                    targetWarehouseId,
                    productId,
                    quantity,
                    reason,
                    priority,
                    status: 'PENDING',
                    requestedBy: userId,
                    requestNotes: notes,
                    expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
                    notes
                },
                include: {
                    sourceWarehouse: true,
                    targetWarehouse: true,
                    product: true,
                    requester: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });



            const reservationNumber = await this.generateReservationNumber();
            // 4. Create stock reservation RESERVED
            const reservation = await tx.stockReservation.create({
                data: {
                    reservationNumber,
                    transferRequestId: transferRequest.id,
                    warehouseId: sourceWarehouseId,
                    productId,
                    quantity,
                    status: 'RESERVED',
                    reservedBy: userId,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    notes: `Reserved for transfer request ${requestNumber}`
                }
            });

            // 5. Update stock reserved quantity


            await this.recordHistory({
                transferRequestId: transferRequest.id,
                action: 'CREATED',
                toStatus: 'PENDING',
                performedBy: userId,
                notes: `Transfer request created for ${quantity} units`,
                metadata: { quantity, priority, reservationNumber }
            });

            await this.recordHistory({
                transferRequestId: transferRequest.id,
                action: 'RESERVATION_CREATED',
                performedBy: userId,
                notes: `Stock reservation created: ${reservationNumber}`,
                metadata: { reservationId: reservation.id, quantity }
            });

            logger.info(`Transfer request created: ${requestNumber} by user ${userId}`);

            return { transferRequest, reservation };





        });

        return {
            success: true,
            data: result.transferRequest,
            reservation: result.reservation,
            message: 'Transfer request created with stock reservation. Awaiting approval.'
        };



    }

    /**
   * STEP 2: Approve Transfer Request
   * Flow: PENDING → APPROVED (Reservation remains RESERVED)
   */
    async approveTransferRequest(transferRequestId, userId, approvalNotes = null) {


        const result = await prisma.$transaction(async (tx) => {
            // 1. Get transfer request with reservation

            const transferRequest = await tx.transferRequest.findUnique({
                where: {
                    id: transferRequestId
                },
                include: {
                    reservation: true,
                    sourceWarehouse: true,
                    product: true
                }
            });

            if (!transferRequest) {
                throw new Error('TRANSFER_REQUEST_NOT_FOUND');
            }

            if (transferRequest.status !== 'PENDING') {
                throw new Error('TRANSFER_REQUEST_NOT_PENDING');
            }

            const reservation = transferRequest.reservation;

            if (!reservation) {
                throw new Error('TRANSFER_REQUEST_NO_RESERVATION');
            }

            if (reservation.status !== 'RESERVED') {
                throw new Error('TRANSFER_REQUEST_RESERVATION_NOT_RESERVED');
            }

            if (reservation.expiresAt && new Date() > reservation.expiresAt) {
                throw new Error('RESERVATION_EXPIRED');
            }
            // 4. Double-check stock availability (in case of changes)
            const sourceStock = await tx.stock.findUnique({
                where: {

                    productId_warehouseId: {
                        productId: transferRequest.productId,
                        warehouseId: transferRequest.sourceWarehouseId
                    }

                }
            });

            const availableQuantity = sourceStock.quantity - sourceStock.reservedQuantity;

            if (availableQuantity < transferRequest.quantity) {
                throw new Error(`INSUFFICIENT_STOCK_FOR_APPROVAL. Available: ${availableQuantity}`);
            }

            // 5. Update transfer request to APPROVED


            const updatedTransferRequest = await tx.transferRequest.update({
                where: {
                    id: transferRequestId
                },
                data: {
                    status: 'APPROVED',
                    approvedAt: new Date(),
                    approvedBy: userId,
                    approvalNotes: approvalNotes
                }
                ,
                include: {
                    sourceWarehouse: true,
                    targetWarehouse: true,
                    product: true,
                    requester: true,
                    approver: {
                        select: { id: true, name: true, email: true }
                    },
                    reservation: true
                }
            });
            await this.recordHistory({
                transferRequestId: transferRequest.id,
                action: 'APPROVED',
                fromStatus: 'PENDING',
                toStatus: 'APPROVED',
                performedBy: userId,
                notes: approvalNotes || 'Transfer request approved',
                metadata: { approvedAt: new Date().toISOString() }
            });

            logger.info(`Transfer request approved: ${transferRequest.requestNumber} by user ${userId}`);

            return updatedTransferRequest;

        });

        return {
            success: true,
            data: result,
            message: 'Transfer request approved. Ready for execution.'
        };


    }

    /**
   * STEP 3: Execute Transfer
   * Flow: APPROVED → EXECUTED, Reservation: RESERVED → CONSUMED
   */

    async executeTransfer(transferRequestId, userId, ExecutionNotes = null) {
        const result = await prisma.$transaction(async (tx) => {

            1//get tranfer
            const transfer = await tx.transferRequest.findUnique({
                where: {
                    id: transferRequestId
                },
                include: {
                    sourceWarehouse: true,
                    targetWarehouse: true,
                    product: true,
                    requester: true,
                    reservation: true
                }
            });

            if (!transfer) throw new Error("TRANSFER_NOT_FOUND");
            if (transfer.status !== "APPROVED") throw new Error("TRANSFER_NOT_APPROVED");


            // 2. Get source stock with reservation

            const sourceStock = await tx.stock.findUnique({
                where: {
                    productId_warehouseId: {
                        productId: transfer.productId,
                        warehouseId: transfer.sourceWarehouseId
                    }
                }
            });

            if (!sourceStock) {
                throw new Error('SOURCE_STOCK_NOT_FOUND');
            }

            const reservation = await tx.stockReservation.findUnique({
                where: {
                    id: transfer.reservationId
                }
            });

            if (!reservation) throw new Error("RESERVATION_NOT_FOUND");
            if (reservation.status !== "RESERVED") throw new Error("RESERVATION_NOT_RESERVED");
            if (!reservation || reservation.status !== 'ACTIVE') {
                throw new Error('RESERVATION_NOT_FOUND_OR_INACTIVE');
            }


            //3 .final stock check
            if (sourceStock.quantity < transfer.quantity) {
                throw new Error(`INSUFFICIENT STOCK. Available: ${sourceStock.quantity}, Required: ${transfer.quantity}`);
            }

            // 4. DEDUCT from source warehouse


            const newSourceQuantity = sourceStock.quantity - transfer.quantity;

            const newSourceReserved = sourceStock.reservedQuantity - transfer.quantity;

            await prisma.stock.update({
                where: { id: sourceStock.id },
                data: {
                    quantity: newSourceQuantity,
                    reservedQuantity: newSourceReserved,
                    availableQuantity: newSourceQuantity - newSourceReserved
                }
            });

            // 5. Record OUT movement for source

            await prisma.stockMovement.create({
                data: {
                    warehouseId: transfer.fromWarehouseId,
                    productId: transfer.productId,
                    type: 'TRANSFER',
                    quantity: -transfer.quantity,
                    reason: `Transfer to ${transfer.toWarehouse.code || transfer.toWarehouse.name}`,
                    createdBy: userId,
                    metadata: {
                        transferId: transfer.id,
                        transferNumber: transfer.transferNumber
                    }
                }
            });

            // 6. ADD to target warehouse


            let targetStock = await tx.stock.findUnique({
                where: {
                    productId_warehouseId: {
                        productId: transfer.productId,
                        warehouseId: transfer.toWarehouseId
                    }
                }
            });

            if (targetStock) {
                await tx.stock.update({
                    where: { id: targetStock.id },
                    data: {
                        quantity: targetStock.quantity + transfer.quantity,
                        availableQuantity: (targetStock.quantity + transfer.quantity) - targetStock.reservedQuantity
                    }
                });
            }
            else {
                targetStock = await prisma.stock.create({
                    data: {
                        warehouseId: transfer.toWarehouseId,
                        productId: transfer.productId,
                        quantity: transfer.quantity,
                        reservedQuantity: 0,
                        availableQuantity: transfer.quantity,
                        minStock: transfer.product.minStock || 5,
                        maxStock: transfer.product.maxStock || 100
                    }
                });
            }


            // 7. Record IN movement for target
            await prisma.stockMovement.create({
                data: {
                    warehouseId: transfer.toWarehouseId,
                    productId: transfer.productId,
                    type: 'TRANSFER',
                    quantity: transfer.quantity,
                    reason: `Transfer from ${transfer.fromWarehouse.code || transfer.fromWarehouse.name}`,
                    createdBy: userId,
                    metadata: {
                        transferId: transfer.id,
                        transferNumber: transfer.transferNumber
                    }
                }
            });

            // 9. Update transfer status to EXECUTED
            const updatedTransfer = await prisma.stockTransferRequest.update({
                where: { id: transferId },
                data: {
                    status: 'EXECUTED',
                    executedBy: userId,
                    executedAt: new Date(),
                    executionNotes
                },
                include: {
                    fromWarehouse: true,
                    toWarehouse: true,
                    product: true,
                    requester: {
                        select: { id: true, name: true, email: true }
                    },
                    approver: {
                        select: { id: true, name: true, email: true }
                    },
                    executor: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });

            // 10. Record history
            await prisma.transferHistoryRecord.create({
                data: {
                    transferId: transfer.id,
                    fromStatus: 'APPROVED',
                    toStatus: 'EXECUTED',
                    action: 'EXECUTED',
                    performedBy: userId,
                    notes: executionNotes || 'Transfer executed successfully',
                    metadata: {
                        executedAt: new Date().toISOString(),
                        sourceStockBefore: sourceStock.quantity,
                        sourceStockAfter: newSourceQuantity,
                        targetStockBefore: targetStock ? targetStock.quantity : 0,
                        targetStockAfter: targetStock ? targetStock.quantity + transfer.quantity : transfer.quantity
                    }
                }
            });

            // 11. Check low stock alert for source warehouse
            if (newSourceQuantity <= (sourceStock.minStock || 5)) {
                await this.createLowStockAlert(transfer.fromWarehouseId, transfer.productId, newSourceQuantity);
            }

            return updatedTransfer;
        });
        logger.info(`Transfer executed: ${result.transferNumber} by user ${userId}`);

        return {
            success: true,
            data: result,
            message: 'Transfer executed successfully'
        };

    }
    /**
   * Cancel Transfer Request
   * Flow: PENDING → CANCELLED, Release reservation
   */
    async cancelTransferRequest(transferRequestId, userId, cancelReason) {
        const result = await prisma.$transaction(async (tx) => {
            const transferRequest = await tx.transferRequest.findUnique({
                where: { id: transferRequestId },
                include: { reservation: true }
            });

            if (!transferRequest) {
                throw new Error('TRANSFER_REQUEST_NOT_FOUND');
            }

            //release reservation
            const reservation = transferRequest.reservation;

            if (reservation && reservation.status == 'RESERVED') {
                const sourceStock = await tx.stock.findUnique({
                    where: {
                        productId_warehouseId: {
                            productId: transferRequest.productId,
                            warehouseId: transferRequest.sourceWarehouseId
                        }
                    }
                });

                if (sourceStock) {
                    const newReserved = sourceStock.reservedQuantity - reservation.quantity;

                    await tx.stock.update({
                        where: { id: sourceStock.id },
                        data: {
                            reservedQuantity: newReserved,
                            availableQuantity: sourceStock.quantity - newReserved
                        }
                    });
                }
                else {
                    throw new Error('SOURCE_STOCK_NOT_FOUND');
                }

                await tx.stockReservation.update({
                    where: { id: reservation.id },
                    data: {
                        status: 'RELEASED',
                        releasedAt: new Date(),
                        releasedBy: userId
                    }
                });


                const updatedRequest = await tx.transferRequest.update(
                    {
                        where: { id: transferRequestId },
                        data: {
                            status: 'CANCELLED'

                        }
                    }
                );

                await this.recordHistory({
                    transferRequestId: transferRequest.id,
                    action: 'CANCELLED',
                    fromStatus: 'PENDING',
                    toStatus: 'CANCELLED',
                    performedBy: userId,
                    notes: cancelReason,
                    metadata: { cancelledAt: new Date().toISOString() }
                }, tx);

                return updatedRequest;
            }
        });

        return {
            success: true,
            data: result,
            message: 'Transfer request cancelled'
        };
    }
    /**
   * Get transfer request with full details
   */

    async getTransferRequestById(id) {
        const transferRequest = await prisma.transferRequest.findUnique({
            where: { id },
            include: {
                sourceWarehouse: true,
                targetWarehouse: true,
                product: true,

                requester: {
                    select: { id: true, name: true, email: true }
                },
                approver: {
                    select: { id: true, name: true, email: true }
                },

                reservation: {
                    include: {
                        reservor: { select: { id: true, name: true } },
                        releasor: { select: { id: true, name: true } }
                    }
                },

                execution: {
                    include: {
                        executor: {
                            select: { id: true, name: true, email: true }
                        },
                        movements: true
                    }
                },

                history: {
                    orderBy: { performedAt: 'asc' },
                    include: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                }
            }
        });
        if (!transferRequest) {
            throw new Error('TRANSFER_REQUEST_NOT_FOUND');
        }
        // Get current stock info
        const sourceStock = await prisma.stock.findUnique({
            where: {
                productId_warehouseId: {
                    productId: transferRequest.productId,
                    warehouseId: transferRequest.sourceWarehouseId
                }
            }
        });

        const targetStock = await prisma.stock.findUnique({
            where: {
                productId_warehouseId: {
                    productId: transferRequest.productId,
                    warehouseId: transferRequest.targetWarehouseId
                }
            }
        });
        if (!sourceStock) {
            throw new Error('SOURCE_STOCK_NOT_FOUND');
        }

        return {
            ...transferRequest,
            currentStock: {
                source: {
                    quantity: sourceStock?.quantity || 0,
                    reserved: sourceStock?.reservedQuantity || 0,
                    available: (sourceStock?.quantity || 0) - (sourceStock?.reservedQuantity || 0)
                },
                target: {
                    quantity: targetStock?.quantity || 0
                }
            }
        };

    }



    //helper methods
    async recordHistory(data, tx = null) {
        const client = tx || prisma;
        return await client.transferHistoryRecord.create({
            data: {
                transferRequestId: data.transferRequestId,
                action: data.action,
                fromStatus: data.fromStatus,
                toStatus: data.toStatus,
                performedBy: data.performedBy,
                notes: data.notes,
                metadata: data.metadata || {}
            }
        });
    }

    async generateTransferNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await prisma.transfer.count({
            where: {
                executedAt: {
                    gte: new Date(year, date.getMonth(), 1),
                    lte: new Date(year, date.getMonth() + 1, 0)
                }
            }
        });
        return `EXE-${year}${month}-${String(count + 1).padStart(5, '0')}`;
    }

    async generateRequestNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await prisma.transferRequest.count(
            {
                where: {
                    requestedAt: {
                        gte: new Date(year, date.getMonth(), 1),
                        lte: new Date(year, date.getMonth() + 1, 0)
                    }
                }
            }
        );
        return `TR-${year}${month}-${String(count + 1).padStart(5, '0')}`;

    }

    async generateReservationNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await prisma.stockReservation.count(
            {
                where: {
                    reservedAt: {
                        gte: new Date(year, date.getMonth(), 1),
                        lte: new Date(year, date.getMonth() + 1, 0)
                    }
                }
            }
        );
        return `SR-${year}${month}-${String(count + 1).padStart(5, '0')}`;

    }

    async validateTransferRequest(data, userId) {
        const { sourceWarehouseId, targetWarehouseId, productId, quantity } = data

        const sourceWarehouse = await prisma.warehouse.findUnique({
            where: {
                id: sourceWarehouseId
            }
        });
        if (!sourceWarehouse) throw new Error('SOURCE_WAREHOUSE_NOT_FOUND');
        if (!sourceWarehouse.isActive) throw new Error('SOURCE_WAREHOUSE_INACTIVE');

        const targetWarehouse = await prisma.warehouse.findUnique({ where: { id: targetWarehouseId } });
        if (!targetWarehouse) throw new Error('TARGET_WAREHOUSE_NOT_FOUND');
        if (!targetWarehouse.isActive) throw new Error('TARGET_WAREHOUSE_INACTIVE');

        if (sourceWarehouseId === targetWarehouseId) {
            throw new Error('SAME_WAREHOUSE_TRANSFER');
        }


        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('PRODUCT_NOT_FOUND');
        // if (!product.isActive) throw new Error('PRODUCT_INACTIVE');

        if (quantity <= 0) throw new Error('INVALID_QUANTITY');

        return true;



    }
}

module.exports = new TransferService();
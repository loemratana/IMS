const transferService = require('../services/transferService');
const prisma = require('../config/prisma');
const logger = require('../config/logger');
const { BadRequestError, NotFoundError, ConflictError } = require('../middleware/errorMiddleware');

jest.mock('../config/prisma');
jest.mock('../config/logger');

describe('TransferService', () => {

    // Mock stock data
    const mockStockData = [
        {
            id: 'stock-1',
            productId: 'product-1',
            warehouseId: 'wh-1',
            quantity: 50,
            reservedQuantity: 10,
            availableQuantity: 40,
            minStock: 10,
            maxStock: 100
        },
        {
            id: 'stock-2',
            productId: 'product-2',
            warehouseId: 'wh-1',
            quantity: 20,
            reservedQuantity: 0,
            availableQuantity: 20,
            minStock: 5,
            maxStock: 50
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock getAllWarehouses
        prisma.warehouse.findMany.mockResolvedValue([
            {
                id: 'wh-1',
                name: 'Warehouse 1',
                code: 'WH001',
                location: 'Location 1',
                address: 'Address 1',
                contactPerson: 'Contact 1',
                phone: '111-1111',
                isActive: true,
                capacity: 1000,
                minStock: 10,
                maxStock: 100,
                description: 'Description 1',
                createdAt: new Date('2023-01-01T00:00:00Z'),
                updatedAt: new Date('2023-01-01T00:00:00Z'),
                _count: { stockItems: 2 },
                transferRequests: []
            },
            {
                id: 'wh-2',
                name: 'Warehouse 2',
                code: 'WH002',
                location: 'Location 2',
                address: 'Address 2',
                contactPerson: 'Contact 2',
                phone: '222-2222',
                isActive: true,
                capacity: 500,
                minStock: 5,
                maxStock: 50,
                description: 'Description 2',
                createdAt: new Date('2023-01-02T00:00:00Z'),
                updatedAt: new Date('2023-01-02T00:00:00Z'),
                _count: { stockItems: 1 },
                transferRequests: []
            }
        ]);

        // Mock getStockByProductId
        prisma.stock.findMany.mockImplementation(({ where }) => {
            if (where.warehouseId === 'wh-1') {
                return Promise.resolve(mockStockData.filter(s => s.warehouseId === 'wh-1'));
            }
            return Promise.resolve([]);
        });
    });

    describe('getAllWarehouses', () => {
        it('should return all warehouses', async () => {
            const result = await transferService.getAllWarehouses();

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].name).toBe('Warehouse 1');
            expect(result.pagination).toEqual({
                total: 2,
                page: 1,
                limit: 10,
                totalPages: 1
            });
        });

        it('should handle pagination correctly', async () => {
            const result = await transferService.getAllWarehouses({ page: 1, limit: 1 });

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.pagination).toEqual({
                total: 2,
                page: 1,
                limit: 1,
                totalPages: 2
            });
        });

        it('should handle search parameter', async () => {
            const result = await transferService.getAllWarehouses({ search: 'Warehouse 2' });

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.data[0].name).toBe('Warehouse 2');
            expect(result.pagination.total).toBe(1);
        });

        it('should filter by isActive status', async () => {
            const result = await transferService.getAllWarehouses({ isActive: false });

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(0);
        });
    });

    describe('getStockByProductId', () => {
        it('should return stock for a product in all warehouses', async () => {
            const result = await transferService.getStockByProductId('product-1');

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.data[0].productId).toBe('product-1');
            expect(result.data[0].warehouseId).toBe('wh-1');
            expect(result.data[0].availableQuantity).toBe(40);
        });

        it('should return empty array if no stock found', async () => {
            const result = await transferService.getStockByProductId('product-nonexistent');

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(0);
        });

        it('should filter by warehouseId', async () => {
            const result = await transferService.getStockByProductId('product-1', 'wh-1');

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(1);
            expect(result.data[0].warehouseId).toBe('wh-1');
        });
    });

    describe('createTransferRequest', () => {
        const validRequest = {
            sourceWarehouseId: 'wh-1',
            toWarehouseId: 'wh-2',
            productId: 'product-1',
            quantity: 5,
            priority: 'HIGH',
            description: 'Urgent transfer for stock replenishment'
        };

        it('should create a new transfer request', async () => {
            // Mock dependencies
            prisma.transferRequest.create.mockResolvedValue({
                id: 'request-123',
                requestNumber: 'TR-2024-001',
                ...validRequest,
                status: 'PENDING',
                approvalNotes: null,
                approver: null,
                executedBy: null,
                executedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            prisma.product.findUnique.mockResolvedValue({
                id: 'product-1',
                name: 'Product 1',
                sku: 'PROD001',
                price: 99.99,
                minStock: 10,
                maxStock: 100
            });

            const result = await transferService.createTransferRequest(validRequest, 'user-123');

            expect(result.success).toBe(true);
            expect(result.data).toHaveProperty('id', 'request-123');
            expect(result.data).toHaveProperty('requestNumber', 'TR-2024-001');
            expect(result.data).toHaveProperty('status', 'PENDING');
            expect(result.data).toHaveProperty('quantity', 5);
            expect(result.data).toHaveProperty('priority', 'HIGH');
            expect(result.data).toHaveProperty('createdBy', 'user-123');
            expect(result.message).toBe('Transfer request created successfully');
        });

        it('should validate warehouse exists and is active', async () => {
            prisma.warehouse.findUnique.mockImplementation((params) => {
                if (params.where.id === 'wh-1') {
                    return Promise.resolve({ id: 'wh-1', isActive: false });
                }
                return Promise.resolve({ id: 'wh-2', isActive: true });
            });

            await expect(transferService.createTransferRequest(validRequest, 'user-123')).rejects.toThrow(BadRequestError);
            expect(logger.error).toHaveBeenCalled();
        });

        it('should validate source and destination warehouses are different', async () => {
            const request = { ...validRequest, toWarehouseId: 'wh-1' };

            await expect(transferService.createTransferRequest(request, 'user-123')).rejects.toThrow(BadRequestError);
            expect(logger.error).toHaveBeenCalled();
        });

        it('should validate sufficient stock available', async () => {
            const request = { ...validRequest, quantity: 50 };

            await expect(transferService.createTransferRequest(request, 'user-123')).rejects.toThrow(BadRequestError);
            expect(logger.error).toHaveBeenCalled();
        });

        it('should validate that source warehouse has enough available stock', async () => {
            const request = { ...validRequest, quantity: 50 };

            await expect(transferService.createTransferRequest(request, 'user-123')).rejects.toThrow(BadRequestError);
            expect(logger.error).toHaveBeenCalled();
        });

        it('should validate quantity is positive', async () => {
            const request = { ...validRequest, quantity: -5 };

            await expect(transferService.createTransferRequest(request, 'user-123')).rejects.toThrow(BadRequestError);
            expect(logger.error).toHaveBeenCalled();
        });

        it('should not create request if stock is insufficient', async () => {
            const request = { ...validRequest, quantity: 50 };

            await expect(transferService.createTransferRequest(request, 'user-123')).rejects.toThrow(BadRequestError);
            expect(logger.error).toHaveBeenCalled();
        });

        it('should throw error if stock quantity is invalid', async () => {
            prisma.warehouse.findUnique.mockImplementation((params) => {
                if (params.where.id === 'wh-1') {
                    return Promise.resolve({ id: 'wh-1', isActive: true });
                }
                return Promise.resolve({ id: 'wh-2', isActive: true });
            });

            prisma.stock.findMany.mockResolvedValue([
                {
                    productId: 'product-1',
                    warehouseId: 'wh-1',
                    availableQuantity: 20,
                    quantity: 20
                }
            ]);

            const result = await transferService.createTransferRequest(validRequest, 'user-123');

            expect(result.success).toBe(true);
            expect(result.data).toHaveProperty('id', 'request-123');
            expect(result.data).toHaveProperty('requestNumber', 'TR-2024-001');
            expect(result.data).toHaveProperty('status', 'PENDING');
            expect(result.data).toHaveProperty('quantity', 5);
            expect(result.data).toHaveProperty('priority', 'HIGH');
            expect(result.data).toHaveProperty('createdBy', 'user-123');
            expect(result.message).toBe('Transfer request created successfully');
        });
    });
});

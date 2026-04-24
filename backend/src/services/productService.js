const prisma = require("../config/database");
const logger = require("../utils/logger");

/**
 * Generate a SKU from product name
 */
function generateSKU(name) {
    const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${rand}`;
}

class ProductService {
    /**
     * Create a new product
     */
    async createProduct(productData) {
        try {
            const {
                name,
                description,
                category_id,
                price,
                min_stock,
                sku,
                image_url
            } = productData;

            // Generate SKU if not provided
            let productSKU = sku;
            if (!productSKU) {
                productSKU = generateSKU(name);
            }

            // Check if SKU already exists
            const existingProduct = await prisma.product.findUnique({
                where: { sku: productSKU }
            });

            if (existingProduct) {
                const error = new Error('A product with this SKU already exists');
                error.statusCode = 409;
                throw error;
            }

            // Handle missing category_id (use or create a 'General' category)
            let finalCategoryId = category_id;
            if (!finalCategoryId || finalCategoryId === 'none') {
                let defaultCategory = await prisma.category.findFirst({
                    where: { name: 'General' }
                });

                if (!defaultCategory) {
                    defaultCategory = await prisma.category.create({
                        data: { name: 'General', description: 'Default category' }
                    });
                }
                finalCategoryId = defaultCategory.id;
            } else {
                // Verify category exists
                const category = await prisma.category.findUnique({
                    where: { id: finalCategoryId }
                });
                if (!category) {
                    const error = new Error('Category not found');
                    error.statusCode = 404;
                    throw error;
                }
            }

            const product = await prisma.product.create({
                data: {
                    name: name.trim(),
                    sku: productSKU,
                    description: description || null,
                    categoryId: finalCategoryId,
                    price: parseFloat(price),
                    minStockLevel: min_stock ? parseInt(min_stock) : 10,
                    image: image_url || null,
                },
                include: {
                    category: { select: { id: true, name: true } }
                }
            });

            logger.info(`Product created: ${product.name} (${product.sku})`);

            return { product, message: 'Product created successfully' };
        } catch (error) {
            logger.error('Error in createProduct:', error);
            throw error;
        }
    }

    /**
     * Get all products with filters and pagination
     */
    async getAllProducts(filters = {}) {
        try {
            const {
                page = 1,
                limit = 20,
                search,
                category_id,
                sort_by = 'createdAt',
                sort_order = 'desc'
            } = filters;

            const pageNum = Number(page);
            const take = Number(limit);
            const skip = (pageNum - 1) * take;

            // Build where clause
            const where = {};

            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } }
                ];
            }

            if (category_id && category_id !== 'all') {
                where.categoryId = category_id;
            }

            const allowedSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
            const validSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'createdAt';
            const validSortOrder = sort_order === 'asc' ? 'asc' : 'desc';

            //  1. Fetch products (NO stock include)
            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    skip,
                    take,
                    orderBy: { [validSortBy]: validSortOrder },
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                        minStockLevel: true,
                        image: true,
                        createdAt: true,
                        categoryId: true,
                        category: {
                            select: { id: true, name: true }
                        }
                    }
                }),
                prisma.product.count({ where })
            ]);

            //  2. Get stock aggregation (ONE query)
            const stockAgg = await prisma.stock.groupBy({
                by: ['productId'],
                _sum: {
                    quantity: true
                }
            });

            // Convert to map for fast lookup
            const stockMap = new Map();
            stockAgg.forEach(s => {
                stockMap.set(s.productId, s._sum.quantity || 0);
            });

            //  3. Merge data
            const productsWithQuantity = products.map(product => {
                const totalQuantity = stockMap.get(product.id) || 0;

                return {
                    ...product,
                    quantity: totalQuantity,
                    minStock: product.minStockLevel,
                    imageUrl: product.image,
                    stockValue: product.price * totalQuantity,
                    isLowStock: totalQuantity <= product.minStockLevel,
                    isActive: true
                };
            });

            return {
                products: productsWithQuantity,
                pagination: {
                    page: pageNum,
                    limit: take,
                    total,
                    totalPages: Math.ceil(total / take),
                    hasNextPage: pageNum * take < total,
                    hasPrevPage: pageNum > 1
                },
                summary: {
                    totalProducts: total,
                    totalStockValue: productsWithQuantity.reduce((sum, p) => sum + p.stockValue, 0),
                    totalQuantity: productsWithQuantity.reduce((sum, p) => sum + p.quantity, 0),
                    lowStockCount: productsWithQuantity.filter(p => p.isLowStock).length
                }
            };

        } catch (error) {
            logger.error('Error in getAllProducts:', error);
            throw error;
        }
    }

    /**
     * Get a single product by ID
     */
    async getProductById(id) {
        try {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: { select: { id: true, name: true } },
                    stock: { select: { quantity: true, warehouse: true } }
                }
            });

            if (!product) {
                const error = new Error('Product not found');
                error.statusCode = 404;
                throw error;
            }

            const totalQuantity = product.stock.reduce((sum, s) => sum + s.quantity, 0);

            return {
                product: {
                    ...product,
                    quantity: totalQuantity,
                    minStock: product.minStockLevel,
                    imageUrl: product.image,
                    isActive: true
                }
            };
        } catch (error) {
            logger.error('Error in getProductById:', error);
            throw error;
        }
    }

    /**
     * Update a product
     */
    async updateProduct(id, updateData) {
        try {
            const existing = await prisma.product.findUnique({ where: { id } });
            if (!existing) {
                const error = new Error('Product not found');
                error.statusCode = 404;
                throw error;
            }

            const {
                name,
                description,
                category_id,
                price,
                min_stock,
                sku,
                image_url
            } = updateData;

            if (sku && sku !== existing.sku) {
                const skuConflict = await prisma.product.findUnique({ where: { sku } });
                if (skuConflict) {
                    const error = new Error('A product with this SKU already exists');
                    error.statusCode = 409;
                    throw error;
                }
            }

            const data = {};
            if (name !== undefined) data.name = name.trim();
            if (description !== undefined) data.description = description;
            if (sku !== undefined) data.sku = sku;
            if (price !== undefined) data.price = parseFloat(price);
            if (min_stock !== undefined) data.minStockLevel = parseInt(min_stock);
            if (image_url !== undefined) data.image = image_url;
            if (category_id !== undefined) data.categoryId = category_id;

            const product = await prisma.product.update({
                where: { id },
                data,
                include: {
                    category: { select: { id: true, name: true } },
                    stock: { select: { quantity: true } }
                }
            });

            const totalQuantity = product.stock.reduce((sum, s) => sum + s.quantity, 0);

            logger.info(`Product updated: ${product.name} (ID: ${id})`);

            return {
                product: {
                    ...product,
                    quantity: totalQuantity,
                    minStock: product.minStockLevel,
                    imageUrl: product.image,
                    isActive: true
                },
                message: 'Product updated successfully'
            };
        } catch (error) {
            logger.error('Error in updateProduct:', error);
            throw error;
        }
    }

    /**
     * Delete a product
     */
    async deleteProduct(id) {
        try {
            const existing = await prisma.product.findUnique({ where: { id } });
            if (!existing) {
                const error = new Error('Product not found');
                error.statusCode = 404;
                throw error;
            }

            // Actual deletion since schema doesn't have isActive/soft-delete for Product
            await prisma.product.delete({
                where: { id }
            });

            logger.info(`Product deleted (ID: ${id})`);

            return { message: 'Product deleted successfully' };
        } catch (error) {
            logger.error('Error in deleteProduct:', error);
            throw error;
        }
    }
}

module.exports = new ProductService();
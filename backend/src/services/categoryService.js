const prisma = require("../config/database");
const logger = require('../utils/logger');
const categoryValidation = require('../validators/categoryValidation');

class CategoryService {
    constructor() {
        this.model = prisma.category;
    }

    /**
     * Validate creation data
     * @param {Object} data 
     */
    validateCreateData(data) {
        if (!data.name || data.name.trim().length < 2) {
            throw new Error('Category name must be at least 2 characters long');
        }
    }

    /**
     * Create new Category
     */
    async createCategory(data, userId = null) {
        try {
            // validate data 
            this.validateCreateData(data);

            // check if category with the same name exists
            const existingCategory = await this.model.findUnique({
                where: {
                    name: data.name
                }
            });

            if (existingCategory) {
                throw new Error('Category already exists');
            }

            // Generate slug if not provided (simple version)
            const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            //create new category
            const category = await this.model.create({
                data: {
                    name: data.name.trim(),
                    description: data.description || null,
                    slug: slug,
                    image: data.image || null,
                    isActive: data.isActive !== undefined ? data.isActive : true
                }
            });

            logger.info(`Category created successfully: ${category.name}`);
            return {
                success: true,
                data: category,
                message: 'Category created successfully'
            };
        } catch (error) {
            logger.error(`Error creating category: ${error.message}`);
            throw error;
        }
    }

    //Update an existing category
    async updateCategory(id, data, userId = null) {

        try {
            // Check if category exists
            const existingCategory = await this.model.findUnique({
                where: {
                    id: id
                }
            });

            if (!existingCategory) {
                throw new Error('Category not found');
            }
            // Check name uniqueness

            if (data.name && data.name !== existingCategory.name) {
                const existingCategoryByName = await this.model.findUnique({
                    where: {
                        name: data.name
                    }
                });
                if (existingCategoryByName) {
                    throw new Error('Category name already exists');
                }
            }

            // Update category
            const updatedCategory = await this.model.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name ? data.name.trim() : undefined,
                    description: data.description ? data.description.trim() : undefined,
                    slug: data.slug ? data.slug.trim() : undefined,
                    image: data.image ? data.image.trim() : undefined,
                    isActive: data.isActive !== undefined ? data.isActive : undefined
                }
            });

            logger.info(`Category updated successfully: ${updatedCategory.name}`);
            return {
                success: true,
                data: updatedCategory,
                message: 'Category updated successfully'
            };
        }
        catch (error) {
            logger.error(`Error updating category: ${error.message}`);
            throw error;
        }
    }

    //   * Delete a category (soft delete if has products, hard delete if empty)
    async deleteCategory(id, userId = null) {
        try {
            const category = await this.model.findUnique({
                where: {
                    id: id
                }
            });

            if (!category) {
                throw new Error('Category not found');
            }

            const productsCount = await this.model.product.count({
                where: {
                    categoryId: id
                }
            });
            let result;
            let message;
            if (productsCount > 0) {
                // Soft delete - just deactivate
                result = await this.model.update({
                    where: {
                        id: id
                    },
                    data: {
                        isActive: false
                    }
                });
                message = 'Category soft deleted successfully';
            }

            else {
                // Hard delete - no products

                result = await this.model.delete({
                    where: { id: id },

                });
                message = 'Category hard deleted successfully';

            }
            logger.info(`Category deleted: ${category.name} (ID: ${category.id}) by user: ${userId || 'system'}`);



        }
        catch (error) {
            logger.error(`Error deleting category: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get all categories with filtering
     */
    async getAllCategories(filters = {}) {
        try {
            const { search, page = 1, limit = 20, includeInactive = false } = filters;
            const pageNum = Number(page);
            const limitNum = Number(limit);


            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ];
            }

            if (!includeInactive) {
                where.isActive = true;
            }

            const total = await this.model.count({ where });
            const categories = await this.model.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { name: 'asc' }
            });

            return {
                success: true,
                data: categories,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error(`Error fetching categories: ${error.message}`);
            throw error;
        }
    }
    //Search categories by name or description

    async searchCategory(searchItem, limit = 20) {
        if (!searchItem || searchItem.trim().length == 0) {
            throw new Error('search item is required')
        }

        try {
            const categories = await this.model.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                },
                take: parseInt(limit),
                orderBy: { name: 'asc' }
            });

            const categoriesWithCounts = categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                description: cat.description,
                parentId: cat.parentId,
                productCount: cat._count.products,
                childCount: cat._count.children,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt
            }));

            return {
                success: true,
                data: categoriesWithCounts,
                count: categoriesWithCounts.length, searchItem,
                message: 'Categories fetched successfully'
            }
        }

        catch (error) {
            logger.error(`Error searching categories: ${error.message}`);
            throw error;
        }

    }

}

module.exports = new CategoryService();

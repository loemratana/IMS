const categoryService = require('../services/categoryService');
const logger = require('../utils/logger');

class CategoryController {
    constructor() {
        this.categoryService = categoryService;
    }

    //create new category controller 
    async createCategory(req, res, next) {
        try {
            const result = await this.categoryService.createCategory(req.body, req.user.id);
            res.status(201).json(result);
        } catch (error) {
            logger.error(`Error creating category: ${error.message}`);
            next(error);
        }
    }

    //update category 
    async updateCategory(req, res, next) {
        try {
            const result = await this.categoryService.updateCategory(req.params.id, req.body, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            logger.error(`Error updating category: ${error.message}`);
            next(error);
        }
    }

    //delete category controller
    async deleteCategory(req, res, next) {
        try {
            const result = await this.categoryService.deleteCategory(req.params.id, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            logger.error(`Error deleting category: ${error.message}`);
            next(error);
        }
    }

    //get all categories controller
    async getAllCategories(req, res, next) {
        try {
            const result = await this.categoryService.getAllCategories(req.query);
            res.status(200).json(result);
        } catch (error) {
            logger.error(`Error fetching categories: ${error.message}`);
            next(error);
        }
    }

}

module.exports = new CategoryController();

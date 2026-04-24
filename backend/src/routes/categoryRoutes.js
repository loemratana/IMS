const express = require('express');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const apicache = require('apicache');
const cache = apicache.middleware;
const categoryValidation = require('../validators/categoryValidation');
const { restrictTo } = require('../middleware/restrictTo');
const categoryController = require('../controllers/categoryController');
const router = express.Router();


// ALL ROUTES REQUIRE AUTHENTICATION
router.use(protect);
// PUBLIC ROUTES (Authenticated users - any role)
router.get('/', cache('1 minute'), restrictTo('ADMIN', 'MANAGER', 'STAFF'), validate(categoryValidation.queryFilters()), (req, res, next) => categoryController.getAllCategories(req, res, next));

//access  Private (Admin, Manager)
router.post('/', restrictTo('ADMIN', 'MANAGER'), validate(categoryValidation.create()), (req, res, next) => categoryController.createCategory(req, res, next));
router.delete('/:id', restrictTo('ADMIN', 'MANAGER'), (req, res, next) => categoryController.deleteCategory(req, res, next));
router.put('/:id', restrictTo('ADMIN', 'MANAGER'), (req, res, next) => categoryController.updateCategory(req, res, next));


module.exports = router;


const express = require('express');
const { validate } = require('../middleware/validationMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/restrictTo');
const apicache = require('apicache');
const cache = apicache.middleware;
const productController = require('../controllers/productController');
const productValidation = require('../validators/productValidation');
const router = express.Router();

// ALL ROUTES REQUIRE AUTHENTICATION
router.use(protect);
// PUBLIC ROUTES (Authenticated users - any role)
router.get('/', cache('1 minute'), restrictTo('ADMIN', 'MANAGER', 'STAFF'), validate(productValidation.getAllProductsValidation()), (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/:id', cache('1 minute'), restrictTo('ADMIN', 'MANAGER', 'STAFF'), validate(productValidation.getProductValidation()), (req, res, next) => productController.getProductById(req, res, next));

// ACCESS PRIVATE (Admin, Manager)
router.post('/', restrictTo('ADMIN', 'MANAGER'), validate(productValidation.createProductValidation()), (req, res, next) => productController.createProduct(req, res, next));
router.put('/:id', restrictTo('ADMIN', 'MANAGER'), validate(productValidation.updateProductValidation()), (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/:id', restrictTo('ADMIN', 'MANAGER'), validate(productValidation.deleteProductValidation()), (req, res, next) => productController.deleteProduct(req, res, next));

module.exports = router;
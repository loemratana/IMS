const express = require('express');
const warehouseController = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/restrictTo');
const { validate } = require('../middleware/validationMiddleware');
const warehouseValidation = require('../validators/warehouseValidation');

const router = express.Router();

router.route('/')
    .get(protect, restrictTo(['ADMIN', 'MANAGER', 'STAFF']), warehouseController.getAllWarehouses)
    .post(protect, restrictTo(['ADMIN', 'MANAGER']), validate(warehouseValidation.create), warehouseController.createWarehouse);

router.route('/:id')
    .get(protect, restrictTo(['ADMIN', 'MANAGER', 'STAFF']), warehouseController.getWarehouseById)
    .put(protect, restrictTo(['ADMIN', 'MANAGER']), validate(warehouseValidation.update), warehouseController.updateWarehouse)
    .delete(protect, restrictTo(['ADMIN']), warehouseController.deleteWarehouse);

module.exports = router;
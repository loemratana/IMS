const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/restrictTo')
const { validate } = require('../middleware/validationMiddleware');
const { inventoryValidation } = require('../validators/invtoryValidation');


const router = express.Router();



// stock
router.post(
    '/stock-in',
    protect,
    restrictTo('ADMIN', 'MANAGER', 'STAFF'),
    validate(inventoryValidation.stockIn),
    inventoryController.stockIn
);

router.post(
    '/stock-out',
    protect,
    restrictTo('ADMIN', 'MANAGER', 'STAFF'),
    validate(inventoryValidation.stockOut),
    inventoryController.stockOut
);

router.get(
    '/current-stock', 
    protect, 
    restrictTo('ADMIN', 'MANAGER', 'STAFF'), 
    inventoryController.getCurrentStock
);

router.post(
    '/transfer',
    protect,
    restrictTo('ADMIN', 'MANAGER'),
    validate(inventoryValidation.transferStock),
    inventoryController.transferStock
);

module.exports = router;

const express = require('express');
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/restrictTo')
const { validate } = require('../middleware/validationMiddleware');
const { body, param } = require('express-validator');
const { createCustomerValidation, updateCustomerValidation, idValidation, bulkDeleteValidation } = require('../utils/customerValidation');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('Admin', 'Sales'), validate(createCustomerValidation), customerController.createCustomer);
router.get('/', restrictTo('Admin', 'Sales', 'Manager'), customerController.getAllCustomers);
router.get('/:id', restrictTo('Admin', 'Sales', 'Manager'), validate(idValidation), customerController.getCustomerById);
router.put('/:id', restrictTo('Admin', 'Sales'), validate(updateCustomerValidation), customerController.updateCustomer);
router.delete('/:id', restrictTo('Admin'), validate(idValidation), customerController.deleteCustomer);
router.post('/bulk-delete', restrictTo('Admin'), validate(bulkDeleteValidation), customerController.bulkDeleteCustomers);

module.exports = router;
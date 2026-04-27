const express = require('express');
const transferController = require('../controllers/transferController');
const { protect } = require('../middleware/authMiddleware');
const apicache = require('apicache');
const cache = apicache.middleware;
const { restrictTo } = require('../middleware/restrictTo');


const router = express.Router();

router.use(protect);

// List transfer requests (any authenticated user with appropriate role)
router.get('/requests',
    restrictTo('admin', 'manager', 'staff'),
    transferController.getAllTransfers
);

// Get transfer request by ID
router.get('/requests/:id',
    restrictTo('admin', 'manager', 'staff'),
    transferController.getTransferRequestById
);

// Create transfer request (any authenticated user)
router.post('/requests',
    restrictTo('admin', 'manager', 'staff'),
    transferController.createTransferRequest
);

// Approve transfer request (admin/manager only)
router.post('/requests/:id/approve',
    restrictTo('admin', 'manager'),
    transferController.approveTransferRequest
);

router.post('/requests/:id/cancel',
    restrictTo('admin', 'manager'),
    transferController.cancelTransferRequest
);

// Execute transfer (admin/manager only)
router.post('/requests/:id/execute',
    restrictTo('admin', 'manager'),
    transferController.executeTransfer
);

module.exports = router;

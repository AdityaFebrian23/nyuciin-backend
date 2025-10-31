const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundry.controller');
const { authMiddleware, superAdminOnly } = require('../middlewares/auth.middleware');

// 🔐 Semua route ini khusus untuk Super Admin
router.post('/', authMiddleware, superAdminOnly, laundryController.createLaundry);
router.get('/', authMiddleware, superAdminOnly, laundryController.getAllLaundries);
router.get('/:id', authMiddleware, superAdminOnly, laundryController.getLaundryById);
router.put('/:id', authMiddleware, superAdminOnly, laundryController.updateLaundry);
router.delete('/:id', authMiddleware, superAdminOnly, laundryController.deleteLaundry);

module.exports = router;

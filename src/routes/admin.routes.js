const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const { authMiddleware, superAdminOnly } = require('../middlewares/auth.middleware');

// ✅ Rute verifikasi laundry — hanya superadmin yang boleh
router.post(
  '/laundry/:id/verify',
  authMiddleware,        // verifikasi token user
  superAdminOnly,        // pastikan role superadmin
  adminCtrl.verifyLaundry
);

module.exports = router;

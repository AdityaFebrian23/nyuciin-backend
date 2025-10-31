const express = require('express');
const router = express.Router();
const { authMiddleware, superAdminOnly } = require('../middlewares/auth.middleware');
const userCtrl = require('../controllers/user.controller');

// ✅ Daftar semua user (superadmin only)
router.get('/', authMiddleware, superAdminOnly, userCtrl.getAllUsers);

// ✅ Ambil satu user
router.get('/:id', authMiddleware, userCtrl.getUserById);

// ✅ Update user
router.put('/:id', authMiddleware, userCtrl.updateUser);

// ✅ Hapus user
router.delete('/:id', authMiddleware, userCtrl.deleteUser);

module.exports = router;

// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * 🔒 Middleware utama: verifikasi JWT dan tempelkan user ke req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User tidak ditemukan' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

/**
 * 🧱 Middleware: hanya Super Admin
 */
const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Hanya Super Admin yang dapat mengakses' });
  }
  next();
};

/**
 * ⚙️ Middleware dinamis: cek role apa pun (admin, petugas, pelanggan, dll.)
 */
const isRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
  };
};

// ✅ Ekspor semua dalam satu objek
module.exports = {
  authMiddleware,
  superAdminOnly,
  isRole
};

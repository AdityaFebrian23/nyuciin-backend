const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// ✅ REGISTER USER BARU
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // cek apakah email sudah terdaftar
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // buat user baru
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: role || 'pelanggan', // default role pelanggan
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    next(err);
  }
};

// ✅ LOGIN USER
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email tidak ditemukan' });
    }

    // cocokkan password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Password salah' });
    }

    // buat JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    next(err);
  }
};

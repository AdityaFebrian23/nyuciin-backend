// src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('❌ MONGO_URI tidak ditemukan di file .env');
    }

    // ⚙️ Koneksi ke MongoDB Atlas
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // timeout lebih panjang biar stabil
    });

    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };

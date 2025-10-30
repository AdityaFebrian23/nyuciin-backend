// src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const os = require('os');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const laundryRoutes = require('./routes/laundry.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

/* 🌐 Deteksi otomatis IP lokal */
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}
const LOCAL_IP = getLocalIP();
console.log(`🌐 Detected local IP: ${LOCAL_IP}`);

/* 🧩 CORS Setup — fix preflight dan Flutter Web */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // izinkan Postman & emulator
      const whitelist = [
        `http://localhost:5173`,
        `http://localhost:5000`,
        `http://${LOCAL_IP}:5173`,
        `http://${LOCAL_IP}:5000`,
        `http://127.0.0.1:5173`,
        `http://127.0.0.1:5000`,
        'http://10.0.2.2:5000',
      ];

      if (whitelist.some((url) => origin.startsWith(url)) || /\.onrender\.com$/.test(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked CORS origin:', origin);
        callback(new Error('CORS not allowed'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // ✅ agar OPTIONS tidak error di browser
  })
);

// ✅ Perbaikan preflight request (OPTIONS)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

/* Middleware umum */
app.use(morgan('dev'));
app.use(express.json());

/* Routes utama */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laundries', laundryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

/* Root endpoint */
app.get('/', (req, res) => {
  res.json({
    ok: true,
    ip: LOCAL_IP,
    message: `🧺 NYUCIIN backend running successfully on http://${LOCAL_IP}:${process.env.PORT || 5000}`,
  });
});

/* Error handler */
app.use(errorHandler);

module.exports = { app, LOCAL_IP };

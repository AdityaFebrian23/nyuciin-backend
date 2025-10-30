const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const os = require('os'); // 📡 untuk deteksi IP otomatis

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const laundryRoutes = require('./routes/laundry.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');

const errorHandler = require('./middleware/error.middleware');

const app = express();

/* -------------------------------------------------------------------------- */
/* 🔍 Deteksi otomatis IP LAN                                                 */
/* -------------------------------------------------------------------------- */
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIP();
console.log(`🌐 Detected local IP: ${LOCAL_IP}`);

/* -------------------------------------------------------------------------- */
/* 🧩 CORS Setup — otomatis izinkan localhost & IP LAN                        */
/* -------------------------------------------------------------------------- */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.startsWith(`http://${LOCAL_IP}`)
    ) {
      return callback(null, true);
    }
    console.log('❌ Blocked CORS origin:', origin);
    return callback(new Error('CORS not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// supaya preflight (OPTIONS) tidak error
app.options('*', cors());

/* -------------------------------------------------------------------------- */
/* 🧠 Middleware umum                                                         */
/* -------------------------------------------------------------------------- */
app.use(morgan('dev'));
app.use(express.json());

/* -------------------------------------------------------------------------- */
/* 🧭 Routes utama                                                            */
/* -------------------------------------------------------------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/laundries', laundryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

/* -------------------------------------------------------------------------- */
/* ✅ Root endpoint                                                           */
/* -------------------------------------------------------------------------- */
app.get('/', (req, res) => {
  res.json({
    ok: true,
    ip: LOCAL_IP,
    message: `🧺 NYUCIIN backend running successfully on http://${LOCAL_IP}:4000`,
  });
});

/* -------------------------------------------------------------------------- */
/* 🧯 Global Error Handler                                                    */
/* -------------------------------------------------------------------------- */
app.use(errorHandler);

module.exports = app;

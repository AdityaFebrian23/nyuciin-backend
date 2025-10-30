require('dotenv').config();
const http = require('http');
const { app, LOCAL_IP } = require('./app');
const { connectDB } = require('../config/db');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // harus 0.0.0.0 agar bisa diakses publik

async function start() {
  try {
    await connectDB();

    const server = http.createServer(app);

    /* ---------------------------------------------------------------------- */
    /* ⚡ Socket.IO Setup                                                     */
    /* ---------------------------------------------------------------------- */
    const io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:5000',
          `http://${LOCAL_IP}:5000`,
          `http://${LOCAL_IP}:5173`,
          /\.onrender\.com$/, // izinkan akses dari domain render
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('🟢 Socket connected:', socket.id);

      socket.on('join', (payload) => {
        if (payload?.userId) socket.join(`user_${payload.userId}`);
        if (payload?.orderId) socket.join(`order_${payload.orderId}`);
        if (payload?.petugasId) socket.join(`petugas_${payload.petugasId}`);
        console.log('👥 Joined rooms:', payload);
      });

      socket.on('location:update', (data) => {
        console.log('📍 Location update:', data);
        if (data.orderId) io.to(`order_${data.orderId}`).emit('location:update', data);
        if (data.userId) io.to(`user_${data.userId}`).emit('location:update', data);
      });

      socket.on('disconnect', () => {
        console.log('🔴 Socket disconnected:', socket.id);
      });
    });

    /* ---------------------------------------------------------------------- */
    /* 🚀 Jalankan Server                                                     */
    /* ---------------------------------------------------------------------- */
    server.listen(PORT, HOST, () => {
      console.log(`✅ Server running at: http://${LOCAL_IP}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

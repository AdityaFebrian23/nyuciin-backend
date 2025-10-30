require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
// 🧠 Ganti dengan IP lokal laptop kamu
const HOST = process.env.HOST || '10.71.103.114';

async function start() {
  try {
    await connectDB();

    const server = http.createServer(app);

    // 🧩 Konfigurasi Socket.IO agar bisa diakses dari Flutter Web & Android Emulator
    const io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:5000',      // dev Flutter web
          'http://10.71.103.114:5000',   // akses via IP lokal
          'http://10.71.103.114:5173',   // kalau pakai vite
          'http://10.71.103.114:5000',      // fallback
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    app.set('io', io);

    // 🎯 Event socket.io
    io.on('connection', (socket) => {
      console.log('🟢 Socket connected:', socket.id);

      // Petugas / user join ke ruang khusus
      socket.on('join', (payload) => {
        if (payload?.userId) socket.join(`user_${payload.userId}`);
        if (payload?.orderId) socket.join(`order_${payload.orderId}`);
        if (payload?.petugasId) socket.join(`petugas_${payload.petugasId}`);
        console.log(`Joined rooms:`, payload);
      });

      // Update lokasi real-time
      socket.on('location:update', async (data) => {
        console.log('📍 Location update:', data);

        if (data.orderId) io.to(`order_${data.orderId}`).emit('location:update', data);
        if (data.userId) io.to(`user_${data.userId}`).emit('location:update', data);
      });

      socket.on('disconnect', () => {
        console.log('🔴 Socket disconnected:', socket.id);
      });
    });

    // 🚀 Jalankan server
    server.listen(PORT, HOST, () => {
      console.log(`✅ Server running at: http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

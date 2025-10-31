const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  lat: Number,
  lng: Number,
});

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: String,
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['superadmin', 'admin_laundry', 'petugas', 'pelanggan'], // ✅ user → pelanggan
    default: 'pelanggan' // default otomatis pelanggan
  },
  addresses: [addressSchema],
  wallet: { 
    type: Number, 
    default: 0 
  },
  lastLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('User', userSchema);

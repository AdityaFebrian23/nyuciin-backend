const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['per_kg','per_item'] , default: 'per_kg'},
  price: Number,
  duration_minutes: Number
});

const laundrySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  description: String,
  address: { street: String, city: String, lat: Number, lng: Number },
  phone: String,
  images: [String],
  services: [serviceItemSchema],
  price_per_kg_default: Number,
  rating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laundry', laundrySchema);

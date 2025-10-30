const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  type: String,
  price: Number,
  qty: Number
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  laundry: { type: mongoose.Schema.Types.ObjectId, ref: 'Laundry' },
  items: [orderItemSchema],
  weight_kg: Number,
  subtotal: Number,
  shipping_fee: Number,
  total: Number,
  pickup_time: Date,
  delivery_time: Date,
  status: {
    type: String,
    enum: ['created','pending_payment','paid','picked_up','processing','done','delivered','cancelled'],
    default: 'created'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String, enum: ['midtrans','bank_transfer','COD','wallet'], default: 'midtrans' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);

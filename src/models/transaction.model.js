const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  gateway: String,
  status: { type: String, enum: ['pending','success','failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  data: Object,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

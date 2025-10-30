const crypto = require('crypto');
const Order = require('../models/order.model');
const Transaction = require('../models/transaction.model');

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';

function verifyMidtransSignature({ order_id, status_code, gross_amount, signature_key }) {
  const input = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`;
  const hash = crypto.createHash('sha512').update(input).digest('hex');
  return hash === signature_key;
}

exports.midtransWebhook = async (req, res, next) => {
  try {
    const payload = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = payload;

    if (!verifyMidtransSignature({ order_id, status_code, gross_amount, signature_key })) {
      console.warn('Invalid midtrans signature', order_id);
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const orderId = (order_id || '').replace(/^NYUCIIN_/, '');
    const order = await Order.findById(orderId);
    if (!order) return res.status(200).json({ message: 'Order not found' });

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      order.status = 'paid';
    } else if (transaction_status === 'pending') {
      order.status = 'pending_payment';
    } else if (['deny','cancel','expire','failure'].includes(transaction_status)) {
      order.status = 'cancelled';
    }

    await order.save();

    await Transaction.create({
      order: order._id,
      user: order.user,
      amount: parseFloat(gross_amount),
      gateway: 'midtrans',
      status: (order.status === 'paid') ? 'success' : (order.status === 'pending_payment' ? 'pending' : 'failed')
    });

    return res.status(200).json({ message: 'ok' });
  } catch (err) {
    next(err);
  }
};

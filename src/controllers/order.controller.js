const Order = require('../models/order.model');
const Laundry = require('../models/laundry.model');

exports.createOrder = async (req, res, next) => {
  try {
    const { laundryId, items, weight_kg, pickup_time, paymentMethod } = req.body;
    const laundry = await Laundry.findById(laundryId);
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });

    let subtotal = 0;
    if (items && items.length) {
      items.forEach(it => subtotal += (it.price || 0) * (it.qty || 1));
    } else {
      subtotal = (laundry.price_per_kg_default || 0) * (weight_kg || 0);
    }

    const shipping_fee = 10000;
    const total = subtotal + shipping_fee;

    const order = await Order.create({
      user: req.user._id,
      laundry: laundry._id,
      items,
      weight_kg,
      subtotal, shipping_fee, total,
      pickup_time, paymentMethod
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('laundry').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

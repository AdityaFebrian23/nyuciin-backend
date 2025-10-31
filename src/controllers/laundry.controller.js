const Laundry = require('../models/laundry.model');

// 🟢 CREATE
exports.createLaundry = async (req, res, next) => {
  try {
    const { name, description, address, phone, services, price_per_kg_default } = req.body;
    const owner = req.user._id;
    const laundry = await Laundry.create({
      owner,
      name,
      description,
      address,
      phone,
      services,
      price_per_kg_default,
    });
    res.status(201).json(laundry);
  } catch (err) {
    next(err);
  }
};

// 🟡 READ (All)
exports.getAllLaundries = async (req, res, next) => {
  try {
    const laundries = await Laundry.find().populate('owner', 'name email role');
    res.json(laundries);
  } catch (err) {
    next(err);
  }
};

// 🟢 READ (Single)
exports.getLaundryById = async (req, res, next) => {
  try {
    const laundry = await Laundry.findById(req.params.id).populate('owner', 'name email');
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });
    res.json(laundry);
  } catch (err) {
    next(err);
  }
};

// 🟠 UPDATE
exports.updateLaundry = async (req, res, next) => {
  try {
    const updates = req.body;
    const laundry = await Laundry.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });
    res.json(laundry);
  } catch (err) {
    next(err);
  }
};

// 🔴 DELETE
exports.deleteLaundry = async (req, res, next) => {
  try {
    const laundry = await Laundry.findByIdAndDelete(req.params.id);
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });
    res.json({ message: 'Laundry deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// 🔍 FILTER / SEARCH (optional)
exports.listNearby = async (req, res, next) => {
  try {
    const { city, q } = req.query;
    const filter = { isActive: true };
    if (city) filter['address.city'] = city;
    if (q) filter['name'] = { $regex: q, $options: 'i' };
    const list = await Laundry.find(filter).limit(50);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

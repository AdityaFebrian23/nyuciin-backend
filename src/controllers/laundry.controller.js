const Laundry = require('../models/laundry.model');

exports.createLaundry = async (req, res, next) => {
  try {
    const { name, description, address, phone, services, price_per_kg_default } = req.body;
    const owner = req.user._id;
    const laundry = await Laundry.create({ owner, name, description, address, phone, services, price_per_kg_default });
    res.status(201).json(laundry);
  } catch (err) {
    next(err);
  }
};

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

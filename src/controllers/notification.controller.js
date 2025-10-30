const Notification = require('../models/notification.model');

exports.listMy = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ toUser: req.user._id }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    next(err);
  }
};

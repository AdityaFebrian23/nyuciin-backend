const Laundry = require('../models/laundry.model');
const Notification = require('../models/notification.model');

exports.verifyLaundry = async (req, res, next) => {
  try {
    const laundryId = req.params.id;
    const { verify } = req.body;
    const laundry = await Laundry.findById(laundryId).populate('owner');
    if (!laundry) return res.status(404).json({ message: 'Laundry not found' });

    laundry.isVerified = !!verify;
    laundry.verifiedAt = verify ? new Date() : null;
    laundry.verifiedBy = req.user._id;
    await laundry.save();

    await Notification.create({
      toUser: laundry.owner._id,
      title: verify ? 'Laundry Verified' : 'Verification Revoked',
      body: verify ? `Your laundry ${laundry.name} has been verified.` : `Verification for ${laundry.name} was revoked.`,
      data: { laundryId: laundry._id }
    });

    const io = req.app.get('io');
    if (io) io.to(`user_${laundry.owner._id}`).emit('laundry:verified', { laundryId: laundry._id, isVerified: laundry.isVerified });

    res.json({ message: 'ok', laundry });
  } catch (err) {
    next(err);
  }
};

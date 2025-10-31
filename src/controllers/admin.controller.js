const Laundry = require('../models/laundry.model');
const Notification = require('../models/notification.model');

// ✅ Verifikasi / cabut verifikasi laundry oleh superadmin
exports.verifyLaundry = async (req, res, next) => {
  try {
    const laundryId = req.params.id;
    const { verify } = req.body;

    const laundry = await Laundry.findById(laundryId).populate('owner');
    if (!laundry) {
      return res.status(404).json({ message: 'Laundry not found' });
    }

    // Update status verifikasi
    laundry.isVerified = !!verify;
    laundry.verifiedAt = verify ? new Date() : null;
    laundry.verifiedBy = req.user._id;
    await laundry.save();

    // Kirim notifikasi ke pemilik laundry
    await Notification.create({
      toUser: laundry.owner._id,
      title: verify ? 'Laundry Verified' : 'Verification Revoked',
      body: verify
        ? `Your laundry "${laundry.name}" has been verified.`
        : `Verification for "${laundry.name}" was revoked.`,
      data: { laundryId: laundry._id }
    });

    // Emit event real-time ke pemilik
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${laundry.owner._id}`).emit('laundry:verified', {
        laundryId: laundry._id,
        isVerified: laundry.isVerified,
      });
    }

    res.json({ message: 'Laundry verification updated', laundry });
  } catch (err) {
    next(err);
  }
};

const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const { permit } = require('../middleware/role.middleware');

router.post('/laundry/:id/verify', auth, permit('superadmin'), adminCtrl.verifyLaundry);

module.exports = router;

const express = require('express');
const router = express.Router();
const laundryCtrl = require('../controllers/laundry.controller');
const auth = require('../middleware/auth.middleware');
const { permit } = require('../middleware/role.middleware');

router.post('/', auth, permit('admin_laundry','superadmin'), laundryCtrl.createLaundry);
router.get('/', laundryCtrl.listNearby);

module.exports = router;

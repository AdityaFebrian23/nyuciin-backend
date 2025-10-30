const express = require('express');
const router = express.Router();
const notificationCtrl = require('../controllers/notification.controller');
const auth = require('../middleware/auth.middleware');

router.get('/me', auth, notificationCtrl.listMy);

module.exports = router;

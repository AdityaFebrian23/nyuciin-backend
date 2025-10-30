const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, orderCtrl.createOrder);
router.get('/me', auth, orderCtrl.listMyOrders);

module.exports = router;

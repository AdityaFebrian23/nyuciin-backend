const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/order.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, orderCtrl.createOrder);
router.get('/me', authMiddleware, orderCtrl.listMyOrders);

module.exports = router;

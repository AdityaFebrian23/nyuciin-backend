const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/payment.controller');

router.post('/midtrans/webhook', express.json(), paymentCtrl.midtransWebhook);

module.exports = router;

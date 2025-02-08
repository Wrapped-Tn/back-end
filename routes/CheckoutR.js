const express = require('express');
const router = express.Router();
const CheckoutC = require('../controllers/CheckoutC');

// Checkout route (change order status to pending and store payment info)
router.post('/checkout', CheckoutC.createCheckout);

module.exports = router;

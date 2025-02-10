const express = require('express');
const router = express.Router();
const CheckoutC = require('../controllers/CheckoutC');

// Checkout route (change order status to pending and store payment info)
router.post('/checkout', CheckoutC.createCheckout);
// Get Checkout information:
router.get('/checkout/:orderId', CheckoutC.getCheckoutInfo);

module.exports = router;

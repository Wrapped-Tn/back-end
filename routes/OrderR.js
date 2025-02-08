const express = require('express');
const router = express.Router();
const OrderC = require('../controllers/OrderC');
const Order = require('../models/Order');

// Get an order by user ID
router.get('/get-order/:userId', OrderC.getOrder);

// Get the count of orders for the logged-in user
router.get('/order-count/:userId', OrderC.getOrderCount);

// Delete an order by cart ID
router.delete('/delete-order/:cartId', OrderC.deleteOrder);

module.exports = router;
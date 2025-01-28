const express = require('express');
const router = express.Router();
const OrderC = require('../controllers/OrderC');

// Get an order by user ID
router.get('/get-order', OrderC.getOrder);

// Delete an order by cart ID
router.delete('/delete-order/:cartId', OrderC.deleteOrder);

module.exports = router;
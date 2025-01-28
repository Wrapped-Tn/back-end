const express = require('express');
const router = express.Router();
const CartC = require('../controllers/CartC');

// Add an order from the cart
router.post('/add-order', CartC.addOrder);

// Delete a cart by ID
router.delete('/delete-cart/:cartId', CartC.deleteCart);

module.exports = router;
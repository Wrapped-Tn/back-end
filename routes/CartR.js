const express = require('express');
const router = express.Router();
const CartC = require('../controllers/CartC');

// Add an order from the cart (add item to cart and handle order placement)
router.post('/add-order', CartC.addToCart);

// Delete a cart by ID
router.delete('/delete-cart/:cartId', CartC.deleteCart);

// Update the quantity of a cart item
router.put('/update-quantity', CartC.updateCartQuantity);

// get cart by id 
router.get('/get-cart/:cartId', CartC.getCartById);

module.exports = router;

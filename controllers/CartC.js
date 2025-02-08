const Cart = require("../models/Cart");
const Order = require("../models/Order");

const addToCart = async (req, res) => {
    try {
        const { userId,postId, article_id, color, size, category, quantity } = req.body;

        if (!postId || !idarticle || !nomarticle || !color || !size || !category || !qte) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, totalPrice: 0 });
        }

        // Add item to cart
        const cartItem = await Cart.create({
            userId,
            postId,
            article_id,
            color,
            size,
            category,
            quantity
        });

        // Calculate total price (Assume you have a price field in CartItem)
        const cartItems = await Cart.findAll({ where: { cartId: cart.id } });
        const totalPrice = cartItems.reduce((sum, item) => sum + item.qte * item.price, 0);

        // Update cart total price
        await cart.update({ totalPrice });

        // Immediately create the order
        const order = await Order.create({
            userId: req.user.id,
            cartId: cart.id,
            totalPrice
        });

        return res.status(201).json({
            message: "Item added to cart and order placed",
            cartItem,
            order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cartId;

        if (!cartId) {
            return res.status(400).json({ message: "Cart ID is required" });
        }

        // Find the cart
        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Delete associated cart items first
        await Cart.destroy({ where: { cartId: cart.id } });

        // Delete associated order(s)
        await Order.destroy({ where: { cartId: cart.id } });

        // Delete the cart itself
        await Cart.destroy({ where: { id: cart.id } });

        return res.status(200).json({ message: "Cart and associated order deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { cartId, quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        // Find the cart item
        const cartItem = await Cart.findByPk(cartId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        if (quantity === 0) {
            // Remove the item if quantity is set to 0
            await cartItem.destroy();
            return res.status(200).json({ message: "Item removed from cart" });
        }

        // Update the quantity
        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({
            message: "Cart quantity updated successfully",
            updatedItem: cartItem
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addToCart, deleteCart, updateCartQuantity };
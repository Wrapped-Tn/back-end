const Cart = require("../models/Cart");
const Order = require("../models/Order");

const CartC = {
    async addOrder(req, res) {
        try {
            const cart = await Cart.findOne({
                where: {
                    userId: req.user.id,
                },
            });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            const order = await Order.create({
                userId: req.user.id,
                cartId: cart.id,
                totalPrice: cart.totalPrice,
            });

            return res.status(201).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    deleteCart(req, res) {
        try {
            const cartId = req.params.cartId;

            if (!cartId) {
                return res.status(400).json({ message: "Cart ID is required" });
                
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        
        return res.status(501).json({ message: "Not implemented" });
    }
};

module.exports = CartC;
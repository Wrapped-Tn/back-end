const Cart = require("../models/Cart");
const Order = require("../models/Order");

const OrderC = {
    async getOrder(req, res) {
        try {
            const orders = await Order.findAll({
                where: {
                    userId: req.user.id,
                },
                include: [Cart],
            });

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "No orders found" });
            }

            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    async deleteOrder(req, res) {
        try {
            // Delete all orders associated with the logged-in user
            const deletedOrders = await Order.destroy({
                where: {
                    userId: req.user.id, // Delete orders for the current user
                },
            });
    
            if (deletedOrders === 0) {
                return res.status(404).json({ message: "No orders found for this user" });
            }
    
            return res.status(200).json({ message: "All orders deleted successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = OrderC;
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const getOrderCount = async (req, res) => {
    try {
        const { userId } = req.params;

        // Trouver la commande avec statut 'init'
        const order = await Order.findOne({
            where: { userId: userId, status: 'init' }
        });

        // Si la commande existe, retourner la longueur de cartIds
        const orderCount = order ? order.cartIds.length : 0;

        return res.status(200).json({ orderCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ orderCount: 0 }); // Retourne 0 en cas d'erreur serveur
    }
};

const getOrder = async (req, res) => {
    try {
       const{userId}=req.params
        const orders = await Order.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Cart,
                    include: [
                        {
                            model: Post,
                            include: [
                                {
                                    model: PostImage,
                                    attributes: ['url'], // Get post image
                                },
                                {
                                    model: PostPosition,
                                    attributes: ['category', 'size', 'prix'], // Get category, size, price
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteOrder = async (req, res) => {
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
};

module.exports = { getOrder, deleteOrder, getOrderCount };
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Post =require("../models/Post");
const PostImage= require("../models/PostImage")
const getOrderCount = async (req, res) => {
    try {
        const { userId } = req.params;

        // Trouver la commande avec statut 'init' et récupérer les Cart associés
        const order = await Order.findOne({
            where: { userId: userId, status: 'init' },
            include: [{ model: Cart }] // Inclure les carts liés
        });

        let cartCount = 0; // Initialisation

        if (order) {
            cartCount = order.Carts ? order.Carts.length : 0; // Compter les carts trouvés
        }

        return res.status(200).json({ cartCount });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ cartCount: 0 }); // Retourne 0 en cas d'erreur serveur
    }
};


const { Op } = require("sequelize");

const getOrder = async (req, res) => {
    try {
        const { userId } = req.params;

        // Trouver la commande avec statut 'init' pour l'utilisateur
        const order = await Order.findOne({
            where: { userId: userId, status: "init" }
        });

        if (!order) {
            return res.status(404).json({ message: "No order found with status 'init'" });
        }

        // Récupérer les paniers associés à la commande
        const carts = await Cart.findAll({
            where: { orderId: order.id },
        });

        if (carts.length === 0) {
            return res.status(404).json({ message: "No carts found for this order" });
        }

        // Trouver les images de chaque panier
        const cartDetails = await Promise.all(carts.map(async (cart) => {
            const post = await Post.findOne({
                where: { id: cart.postId },
                include: [{
                    model: PostImage,
                    attributes: ['id', 'url']
                }],
            });
            return {
                cart,
                images: post.PostImages
            };
        }));

        return res.status(200).json({
            order,
            cartDetails
        });

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
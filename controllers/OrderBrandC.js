const Cart = require("../models/Cart");
const OrderBrand = require("../models/OrderBrand");
const { Op } = require("sequelize");
const Post = require("../models/Post");
const PostImage = require("../models/PostImage");


const getOrderBrand=async(req,res)=>{
    try {
        const { brandId } = req.params;

        // Trouver toutes les commandes de l'utilisateur sauf celles avec le statut 'init'
        const orders = await OrderBrand.findAll({
            where: {
                brandId: brandId
            }
        });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        // Récupérer les paniers associés aux commandes
        const ordersWithCarts = await Promise.all(orders.map(async (order) => {
            const carts = await Cart.findAll({
                where: { orderBrandId: order.id },
            });

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
                    images: post ? post.PostImages : []
                };
            }));

            return {
                order,
                cartDetails
            };
        }));

        return res.status(200).json(ordersWithCarts);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Récupérer la commande
        const order = await OrderBrand.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Liste des statuts dans l'ordre
        const statusFlow = ['pending', 'preparation', 'shipped', 'delivered', 'returned'];

        // Trouver l'index du statut actuel
        const currentIndex = statusFlow.indexOf(order.status);

        // Vérifier s'il existe un statut suivant
        if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
            return res.status(400).json({ message: "No next status available" });
        }

        // Mettre à jour le statut avec le suivant
        order.status = statusFlow[currentIndex + 1];
        await order.save();

        return res.status(200).json({ message: "Order status updated", order });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {getOrderBrand,updateOrderStatus}
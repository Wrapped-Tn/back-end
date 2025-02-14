const Article = require("../models/Article");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Post = require("../models/Post");
const PostImage = require("../models/PostImage");

const addToCart = async (req, res) => {
    try {
        const { userId, postId, article_id, color, size, category, quantity, price,posterId,brandId } = req.body;

        // Vérifier que tous les champs sont fournis
        if (!postId || !article_id || !userId || !color || !size || !category || !quantity || !price || !posterId|| !brandId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Vérifier que 'price' et 'quantity' sont des nombres valides
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: "Invalid price value" });
        }
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ message: "Invalid quantity value" });
        }

        // Créer un nouveau panier
        const totalPrice = quantity * price;
    
        // Trouver une commande existante de l'utilisateur avec statut "init"
        let order = await Order.findOne({
            where: { userId: userId, status: 'init' }
        });

        // Si la commande n'existe pas, créer une nouvelle commande
        if (!order) {
            order = await Order.create({
                userId,
                totalPrice, // Prix total initial
                status: 'init', // État de la commande
                deliveryCost: 8, // Exemple de coût de livraison
            });

        } else {
            // Mise à jour de la commande
            await Order.update(
                {
                    totalPrice: order.totalPrice + totalPrice, // Mise à jour du total
                },
                { where: { id: order.id } }
            );

            // Recharger les données mises à jour
            order = await Order.findOne({ where: { id: order.id } });
        }
        // Ajouter l'article au panier de la commande
        const cart = await Cart.create({
            userId,
            postId,
            brandId,
            article_id,
            posterId,
            color,
            size,
            category,
            quantity,
            totalPrice, // Calcul du prix total pour cet article
            orderId:order.id
        });

        return res.status(200).json({
            message: "Item added to cart and order updated",
            cart,
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

        // Find the cart by its ID
        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Delete associated order(s)
        await Order.destroy({ where: { id: cart.orderId } });

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

        // Trouver l'article dans le panier
        const cartItem = await Cart.findByPk(cartId);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Trouver l'article associé
        const articleItem = await Article.findByPk(cartItem.article_id);
        if (!articleItem) {
            return res.status(404).json({ message: "Article not found" });
        }

        // Trouver la commande associée
        const orderItem = await Order.findByPk(cartItem.orderId);
        if (!orderItem) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (quantity === 0) {
            // Soustraire le totalPrice actuel avant de supprimer l'article du panier
            orderItem.totalPrice -= cartItem.totalPrice;
            await orderItem.save();

            // Supprimer l'item du panier
            await cartItem.destroy();
            return res.status(200).json({ message: "Item removed from cart" });
        }

        // Mettre à jour la quantité et recalculer le prix total du panier
        const oldTotalPrice = cartItem.totalPrice;
        cartItem.quantity = quantity;
        cartItem.totalPrice = quantity * articleItem.price;
        await cartItem.save();

        // Mettre à jour le prix total de la commande en tenant compte de l'ancien total
        orderItem.totalPrice = orderItem.totalPrice - oldTotalPrice + cartItem.totalPrice;
        await orderItem.save();

        return res.status(200).json({
            message: "Cart quantity updated successfully",
            updatedItem: cartItem
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCartById = async (req, res) => {
    try {
        const { cartId } = req.params;

        if (!cartId) {
            return res.status(400).json({ message: "Cart ID is required" });
        }

        // Trouver le panier par ID
        const cart = await Cart.findByPk(cartId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const post=await Post.findOne({where:{id:cart.postId},
            include: [{
                model: PostImage,
                attributes: ['id', 'url']
            }],
        })
        const image=post.PostImages

        return res.status(200).json({cart,image});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addToCart, deleteCart, updateCartQuantity,getCartById  };
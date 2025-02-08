const Cart = require("../models/Cart");
const Order = require("../models/Order");

const addToCart = async (req, res) => {
    try {
        const { userId, postId, article_id, color, size, category, quantity, price } = req.body;

        // Vérifier que tous les champs sont fournis
        if (!postId || !article_id || !userId || !color || !size || !category || !quantity || !price) {
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
        const cart = await Cart.create({
            userId,
            postId,
            article_id,
            color,
            size,
            category,
            quantity,
            totalPrice, // Calcul du prix total pour cet article
        });

        // Trouver une commande existante de l'utilisateur avec statut "init"
        let order = await Order.findOne({
            where: { userId: userId, status: 'init' }
        });

        // Si la commande n'existe pas, créer une nouvelle commande
        if (!order) {
            order = await Order.create({
                userId,
                cartIds: [cart.id], // Associer le panier à la commande
                totalPrice, // Prix total initial
                status: 'init', // État de la commande
                deliveryCost: 8, // Exemple de coût de livraison
            });
        } else {
            // Vérifier que cartIds est bien un tableau
            let updatedCartIds = Array.isArray(order.cartIds) ? [...order.cartIds, cart.id] : [cart.id];

            // Mise à jour de la commande
            await Order.update(
                {
                    cartIds: updatedCartIds, // Ajout du nouvel ID de panier
                    totalPrice: order.totalPrice + totalPrice, // Mise à jour du total
                },
                { where: { id: order.id } }
            );

            // Recharger les données mises à jour
            order = await Order.findOne({ where: { id: order.id } });
        }

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
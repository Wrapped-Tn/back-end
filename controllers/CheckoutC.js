const Order = require('../models/Order');
const Checkout = require('../models/Checkout');
const OrderBrand = require('../models/OrderBrand');
const Cart = require('../models/Cart');

const createCheckout = async (req, res) => {
    try {
        const { orderId, payType } = req.body;
        const userId = req.user.id;  // Assuming the user is authenticated

        // Find the order to ensure it belongs to the user and is in 'init' status
        const order = await Order.findOne({
            where: {
                id: orderId,
                userId: userId,
                status: 'init'  // Only process orders in 'init' status
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found or not eligible for checkout" });
        }

        // Change the order status to 'pending'
        order.status = 'pending';
        await order.save();

        // Create the checkout entry
        const checkout = await Checkout.create({
            userId: userId,
            orderId: order.id,
            payType: payType  // 'a' or 'b'
        });

        

        // Return response
        return res.status(200).json({
            message: "Checkout successful",
            checkout,
            order
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCheckoutInfo=async(req,res)=>{
    try {
        const {orderId}=req.params;

        const order=await Order.findByPk(orderId)
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        let total= order.totalPrice+order.deliveryCost
        let totalPrice=order.totalPrice;
        let deliveryCost=order.deliveryCost;
            
        
        return res.status(200).json({total,totalPrice,deliveryCost})

    }catch(e){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const checkout = async (req, res) => {
    try {
        const { paytype, userId, orderId, adressId, brandIds } = req.body;
        const today = new Date().toISOString().split('T')[0]; // Récupérer la date au format YYYY-MM-DD
        
        // 1. Mettre à jour le statut de la commande utilisateur
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = "pending";
        order.adressId = adressId;
        await order.save();

        // 2. Itérer sur chaque brandId pour créer un OrderBrand
        let totalCheckoutPrice = 0;
        let orderBrandId = 0;
        for (let brandId of brandIds) {
            let orderBrand = await OrderBrand.findOne({
                where: {
                    brandId:brandId,
                    status: 'pending'
                }
            });
            console.log(orderBrand);
            
            // 3. Récupérer les articles du panier pour cette marque
            const cart = await Cart.findAll({ where: { brandId } });
            if (!cart.length) {
                return res.status(400).json({ message: `Cart is empty for brandId: ${brandId}` });
            }

            // Calcul du prix total pour chaque marque
            const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
            totalCheckoutPrice += totalPrice;

            // 4. Créer un nouvel OrderBrand ou mettre à jour l'existant
            if (orderBrand) {
                // Si l'OrderBrand existe déjà pour la marque et la date, on met à jour le totalPrice
                orderBrand.totalPrice += totalPrice;
                await orderBrand.save();
            } else {
                // Sinon, on crée un nouvel OrderBrand
                orderBrand = await OrderBrand.create({ 
                    brandId, 
                    totalPrice, 
                    status: 'pending', 
                    order_date: today 
                });
            }

            // 5. Associer chaque article du panier à l'OrderBrand
            await Promise.all(cart.map(item => {
                item.orderBrandId = orderBrand.id;
                return item.save();
            }));
            orderBrandId = orderBrand.id;  // Enregistrer l'id du dernier OrderBrand
        }

        // 6. Créer l'enregistrement de checkout global
        const checkout = await Checkout.create({ 
            userId, 
            orderId, 
            orderBrandId: orderBrandId,
            totalPrice: totalCheckoutPrice,
            payType: paytype
        });

        return res.status(200).json({ checkout });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




module.exports = { createCheckout,getCheckoutInfo,checkout };

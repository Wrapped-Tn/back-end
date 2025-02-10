const Order = require('../models/Order');
const Checkout = require('../models/Checkout');

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

module.exports = { createCheckout,getCheckoutInfo };

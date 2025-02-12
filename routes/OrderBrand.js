const express = require('express');
const router = express.Router();
const OrderBrandC = require('../controllers/OrderBrandC');


router.get('/get-ordersbrands/:brandId', OrderBrandC.getOrderBrand);
router.get('/get-salesbrand/:brandId', OrderBrandC.getSalesByBrand);
router.put('/status/:orderId', OrderBrandC.updateOrderStatus); // Nouvelle route pour changer le statut


module.exports = router;

const Orders = require('../models/Orders.js');

// Créer une commande
const createOrder = async (req, res) => {
  const { seller_id, product_id, quantity, price, status, order_date } = req.body;

  try {
    const newOrder = await Orders.create({
      seller_id,
      product_id,
      quantity,
      price,
      status,
      order_date
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Récupérer une commande par ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

// Récupérer toutes les commandes
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Mettre à jour une commande
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { quantity, price, status } = req.body;

  try {
    const order = await Orders.findByPk(id);
    if (order) {
      order.quantity = quantity || order.quantity;
      order.price = price || order.price;
      order.status = status || order.status;
      await order.save();
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Supprimer une commande
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);
    if (order) {
      await order.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};

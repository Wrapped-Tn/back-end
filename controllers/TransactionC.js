const Transaction = require('../models/Transaction.js');

// Créer une transaction
const createTransaction = async (req, res) => {
  const { user_id, item_id, amount, transaction_date } = req.body;

  try {
    const newTransaction = await Transaction.create({ user_id, item_id, amount, transaction_date });
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Lire une transaction
const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
};

// Mettre à jour une transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, transaction_date } = req.body;

  try {
    const transaction = await Transaction.findByPk(id);
    if (transaction) {
      transaction.amount = amount || transaction.amount;
      transaction.transaction_date = transaction_date || transaction.transaction_date;
      await transaction.save();
      res.status(200).json(transaction);
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Supprimer une transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);
    if (transaction) {
      await transaction.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};

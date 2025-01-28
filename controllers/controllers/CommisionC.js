const Commission = require('../models/Commission.js');

// Créer une commission
const createCommission = async (req, res) => {
  const { user_id, transaction_id, amount } = req.body;

  try {
    const newCommission = await Commission.create({ user_id, transaction_id, amount });
    res.status(201).json(newCommission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create commission' });
  }
};

// Lire une commission
const getCommissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const commission = await Commission.findByPk(id);
    if (commission) {
      res.status(200).json(commission);
    } else {
      res.status(404).json({ error: 'Commission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve commission' });
  }
};

// Mettre à jour une commission
const updateCommission = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const commission = await Commission.findByPk(id);
    if (commission) {
      commission.amount = amount || commission.amount;
      await commission.save();
      res.status(200).json(commission);
    } else {
      res.status(404).json({ error: 'Commission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update commission' });
  }
};

// Supprimer une commission
const deleteCommission = async (req, res) => {
  const { id } = req.params;

  try {
    const commission = await Commission.findByPk(id);
    if (commission) {
      await commission.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Commission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete commission' });
  }
};

module.exports = {
  createCommission,
  getCommissionById,
  updateCommission,
  deleteCommission,
};

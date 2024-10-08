const express = require('express');
const {
  createCommission,
  getCommissionById,
  updateCommission,
  deleteCommission,
} = require('../controllers/CommisionC.js');

const router = express.Router();

// Créer une commission
router.post('/', createCommission);

// Lire une commission par ID
router.get('/:id', getCommissionById);

// Mettre à jour une commission
router.put('/:id', updateCommission);

// Supprimer une commission
router.delete('/:id', deleteCommission);

module.exports = router;

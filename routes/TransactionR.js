const express = require('express');
const {
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/TransactionC.js');

const router = express.Router();

// Créer une transaction
router.post('/', createTransaction);

// Lire une transaction par ID
router.get('/:id', getTransactionById);

// Mettre à jour une transaction
router.put('/:id', updateTransaction);

// Supprimer une transaction
router.delete('/:id', deleteTransaction);

module.exports = router;

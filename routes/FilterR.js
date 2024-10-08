const express = require('express');
const {
  createFilter,
  getFilterById,
  updateFilter,
  deleteFilter
} = require('../controllers/FilterC');

const router = express.Router();

// Créer un filtre
router.post('/', createFilter);

// Lire un filtre par ID
router.get('/:id', getFilterById);

// Mettre à jour un filtre
router.put('/:id', updateFilter);

// Supprimer un filtre
router.delete('/:id', deleteFilter);

module.exports = router;

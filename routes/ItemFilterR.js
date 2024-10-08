const express = require('express');
const {
  createItemFilter,
  getItemFilterById,
  updateItemFilter,
  deleteItemFilter,
} = require('../controllers/ItemFilterC');

const router = express.Router();

// Créer une association article-filtre
router.post('/', createItemFilter);

// Lire une association article-filtre par ID
router.get('/:id', getItemFilterById);

// Mettre à jour une association article-filtre
router.put('/:id', updateItemFilter);

// Supprimer une association article-filtre
router.delete('/:id', deleteItemFilter);

module.exports = router;

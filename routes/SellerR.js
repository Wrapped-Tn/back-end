const express = require('express');
const {
  createSeller,
  getSellerById,
  updateSeller,
  deleteSeller
} = require('../controllers/SellerC');

const router = express.Router();

// Créer un vendeur
router.post('/', createSeller);

// Lire un vendeur par ID
router.get('/:id', getSellerById);

// Mettre à jour un vendeur
router.put('/:id', updateSeller);

// Supprimer un vendeur
router.delete('/:id', deleteSeller);

module.exports = router;

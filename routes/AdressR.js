const express = require('express');
const router = express.Router();
const addressController = require('../controllers/AdreesC');

// Créer une adresse
router.post('/address', addressController.createAddress);

// Récupérer toutes les adresses
router.get('/addresses', addressController.getAllAddresses);

// Récupérer une adresse par ID
router.get('/address/:id', addressController.getAddressById);

// Récupérer une adresse par ID
router.get('/selectedAdress/:userId', addressController.getAddressByStatusTrueAndUserId);

// Mettre à jour une adresse
router.put('/address/:id', addressController.updateAddress);

// Mettre à jour le statut d'une adresse
router.put('/address/:id/status', addressController.updateAddressStatus);

// Supprimer une adresse
router.delete('/address/:id', addressController.deleteAddress);

module.exports = router;

const express = require('express');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/UserC.js');

const router = express.Router();

// Créer un utilisateur
router.post('/', createUser);

// Lire un utilisateur par ID
router.get('/:id', getUserById);

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

module.exports = router;

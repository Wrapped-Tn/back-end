const express = require('express');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUser
} = require('../controllers/UserC.js');

const router = express.Router();

// Créer un utilisateur
router.post('/', createUser);

// Lire un utilisateur par ID
router.get('/:id', getUserById);

// Lire tous les utilisateurs 
router.get('/', getAllUser);

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

module.exports = router;

const express = require('express');
const {
  createUserWithGrade,
  getUserById,
  updateUser,
  deleteUser,
  getAllUser,
  getUserCart,
  updatePofileImg
} = require('../controllers/UserC.js');

const router = express.Router();

// Créer un utilisateur
router.post('/', createUserWithGrade);

// Lire un utilisateur par ID
router.get('/:id', getUserById);

// Lire tous les utilisateurs 
router.get('/', getAllUser);
router.post('/UserCart',getUserCart)

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Mettre à jour Photo de profile
router.put('/profilepic/:id',updatePofileImg);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

module.exports = router;

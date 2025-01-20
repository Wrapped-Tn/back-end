const express = require('express');
const {
  createUserWithGrade,
  getUserById,
  updateUser,
  deleteUser,
  getAllUser,
  getUserCart,
  updatePofileImg,
  getUserWithAuth,
  updateUserWithAuth,
  getUserProfile
} = require('../controllers/UserC.js');

const router = express.Router();

// Créer un utilisateur
router.post('/', createUserWithGrade);

// Lire un utilisateur par ID
router.get('/:id', getUserById);

// Lire tous les utilisateurs 
router.get('/', getAllUser);
router.post('/UserCart',getUserCart)
router.get('/UserAuth/:user_id',getUserWithAuth)
router.get('/userProfile/:idUser',getUserProfile)
router.put('/UserAuth/:user_id',updateUserWithAuth)
// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Mettre à jour Photo de profile
router.put('/profilepic/:id',updatePofileImg);

// Supprimer un utilisateur
router.delete('/:id', deleteUser);

module.exports = router;

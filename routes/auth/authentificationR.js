const express = require('express');
const router = express.Router();
const { loginUser, checkPass } = require('../../controllers/Auth/authentification');

// Route pour la connexion de l'utilisateur
router.post('/login', loginUser);

// Route pour vérifier le mot de passe de l'utilisateur
router.post('/check-password', checkPass);

module.exports = router;

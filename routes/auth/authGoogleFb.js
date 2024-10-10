const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route pour démarrer l'authentification Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Route de rappel Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Authentification réussie, redirige vers la page souhaitée
    res.redirect('/'); // Change ceci selon tes besoins
  }
);

// Route pour démarrer l'authentification Facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email'],
}));

// Route de rappel Facebook
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Authentification réussie, redirige vers la page souhaitée
    res.redirect('/'); // Change ceci selon tes besoins
  }
);

module.exports = router;

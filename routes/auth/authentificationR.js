const express = require('express');
const router = express.Router();
const { loginUser, checkPass, forgotPassword, verifyCode, resetPassword, checkEmailExists, sendVerificationCode ,finduserbyemail} = require('../../controllers/Auth/authentification');

// Route pour la connexion de l'utilisateur
router.post('/login', loginUser);

// Route pour vérifier le mot de passe de l'utilisateur
router.post('/check-password', checkPass);

// Route to handle forgot password (generate and send code)
router.post('/forgot-password', forgotPassword);

// Route to verify the code sent to the user's email
router.post('/verify-code', verifyCode);

// Route to reset the user's password
router.post('/reset-password', resetPassword);

// Route pour vérifier si l'email existe déjà dans la base de données
router.post('/check-email', checkEmailExists);

// Route to send verification code
router.post('/send-verification-code', sendVerificationCode);


router.get('/email', finduserbyemail);

module.exports = router;

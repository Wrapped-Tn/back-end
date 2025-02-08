require('dotenv').config();
const Auth = require('../../models/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Utiliser un secret partagé pour signer les tokens
const secretKey = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: 'Gmail', // ou un autre fournisseur d'email
  auth: {
    user: process.env.EMAIL_USER , // Votre email
    pass: process.env.EMAIL_PASS, // Votre mot de passe
  },
});

// Déclaration de la variable pour stocker les codes de vérification
const verificationCodes = new Map(); // Utilisation d'un Map pour stocker les codes

function generateToken(id, fullName) {
  return jwt.sign({ id, fullName }, secretKey, { expiresIn: '1h' });
}

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000); // Génère un nombre aléatoire à 4 chiffres
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  console.log('Login request received:',req.body);

  try {
    const user = await Auth.findOne({ where: { email } });
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);
    const idUser = user.users_id;
    const role = user.role; // Inclure le rôle dans la réponse
    const idAuth = user.id
    console.log('Generated token:', token);

    res.status(200).json({ token, idUser, role ,idAuth});
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function checkPass(req, res) {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user.id, user.email);
    const role = user.role; // Inclure le rôle dans la réponse
    res.status(200).json({ token, role });
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Générer le code à 4 chiffres
    const code = generateCode();
    console.log('Generated code:', code);

    // Stocker le code avec une expiration de 1:30 minute (90000 ms)
    verificationCodes.set(email, { code, expiresAt: Date.now() + 90000 });

    // Envoyer le code par e-mail
    const mailOptions = {
      from: process.env.EMAIL_USER ,
      to: email,
      subject: 'Code de réinitialisation de mot de passe',
      text: `Votre code de réinitialisation de mot de passe est ${code}. Ce code expirera dans 1 minute.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Password reset code sent to email' });
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function verifyCode(req, res) {
  const { email, code } = req.body;

  try {
    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return res.status(200).json({ message: 'No code found for this email' });
    }

    const { code: storedCode, expiresAt } = storedData;

    // Vérifier si le code a expiré
    if (Date.now() > expiresAt) {
      return res.status(200).json({ valid:false, message: 'Code has expired' });
    }

    // Vérifier si le code correspond
    if (parseInt(code) !== storedCode) {
      return res.status(200).json({ valid:false, message: 'Invalid code' });
    }

    // Le code est valide
    res.status(200).json({ valid:true, message: 'Code is valid, proceed to reset password' });

  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  try {
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the user and update their password
    const user = await Auth.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function checkEmailExists(req, res) {
  const { email } = req.body;

  try {
    const user = await Auth.findOne({ where: { email } });

    if (user) {
      return res.status(201).json({ exists: true, message: 'Email already in use' });
    } else {
      return res.status(200).json({ exists: false, message: 'Email is available' });
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// This API will handle sending the verification code to the user's email
async function sendVerificationCode(req, res) {
  const { email } = req.body;  // Get the email from the request body

  try {
    // Check if email already exists in the system or if there's an existing verification code
    const storedData = verificationCodes.get(email);

    // If verification code exists, just re-send the code
    if (storedData) {
      // Check if the code has expired
      if (Date.now() < storedData.expiresAt) {
        return res.status(200).json({
          message: 'Verification code has already been sent. Please check your inbox.'
        });
      }
    }

    // Generate the verification code
    const code = generateCode();
    console.log('Generated verification code:', code);

    // Store the code along with the expiration time (1 minute 30 seconds)
    verificationCodes.set(email, { code, expiresAt: Date.now() + 90000 });

    // Send the verification code via email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address from environment variables
      to: email,  // The email provided in the request
      subject: 'Email Verification Code', // Email subject
      text: `Your verification code is ${code}. This code will expire in 1 minute and 30 seconds.` // Email body
    };

    // Send the email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending verification email.' });
      }

      console.log('Verification email sent:', info.response);
      return res.status(200).json({
        message: 'Verification code sent to email. Please verify your account.',
      });
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const finduserbyemail=async(req, res)=>{
  const user = await Auth.findAll();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
    
}

module.exports = {
  loginUser,
  checkPass,
  forgotPassword,
  verifyCode,
  resetPassword,
  checkEmailExists,
  sendVerificationCode,
  finduserbyemail
};

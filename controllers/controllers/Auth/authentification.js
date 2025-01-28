require('dotenv').config();

const Auth = require('../../models/Auth');
const User = require('../../models/User');
const Grade = require('../../models/Grade');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Utiliser un secret partagé pour signer les tokens
const secretKey = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Déclaration de la variable pour stocker les codes de vérification
const verificationCodes = new Map(); // Utilisation d'un Map pour stocker les codes

function generateToken(id, fullName) {
  return jwt.sign({ id, fullName }, secretKey, { expiresIn: '1h' });
};

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
};

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
};

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
};

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
};

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
};

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000); // Génère un nombre aléatoire à 4 chiffres
};

async function verifyCode(req, res) {
  const { email, code } = req.body;

  try {
    // Step 1: Get the stored verification code
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return res.status(400).json({ message: 'No verification code found for this email.' });
    }

    const { code: storedCode, expiresAt } = storedData;

    // Step 2: Check if the verification code has expired
    if (Date.now() > expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).json({ message: 'Verification code has expired.' });
    }

    // Step 3: Validate the verification code
    if (parseInt(code) !== storedCode) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Step 4: Find the Auth record for the provided email
    const auth = await Auth.findOne({ where: { email } });

    if (!auth) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    // Step 5: Ensure required fields are available from the Auth record
    const { full_name, phone_number, profile_picture_url, region, role, sexe, birthdate, password } = auth;

    // Check if the necessary fields are missing
    if (!full_name || !sexe || !birthdate || !password) {
      return res.status(400).json({ message: 'Missing required fields for user creation.' });
    }

    // Step 6: Create a new grade
    const newGrade = await Grade.create({
      grade_name: 'Débutant',
      min_stars: 0,
      max_stars: 100,
      min_sales: 0,
      max_sales: 10,
      rewards: 'Badge, accès aux statistiques de ses recommandations',
    });

    // Log the user data before creating the user
    console.log("Creating new user with data:", {
      full_name,
      email,
      password,
      profile_picture_url,
      grade_id: newGrade.id,
      birthdate,
      sexe,
      commission_earned: 0,
    });

    // Step 7: Create the new User record
    const newUser = await User.create({
      full_name,
      email,
      password,
      profile_picture_url,
      grade_id: newGrade.id,
      birthdate,
      sexe,
      user_type: role || 'regular', // Use default if not provided
      commission_earned: 0,
    });

    // Step 8: Link the user to the Auth record and set it as active
    auth.users_id = newUser.id;
    auth.isActive = true;
    await auth.save();

    // Step 9: Clean up verification codes and respond
    verificationCodes.delete(email);

    return res.status(200).json({ message: 'Account verified successfully!' });

  } catch (error) {
    // Step 10: Log and handle errors
    console.error('Error verifying code:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = {
  loginUser,
  checkPass,
  forgotPassword,
  verifyCode,
  resetPassword,
  checkEmailExists,
  generateCode,
  verificationCodes,
  transporter,
};

require('dotenv').config();
const User = require('../models/Users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Utiliser une clé RSA pour signer les tokens
const privateKey = fs.readFileSync('./path/to/private.pem', 'utf8');
const publicKey = fs.readFileSync('./path/to/public.pem', 'utf8');

const generateToken = (userId, userName) => {
  const expiresIn = 60 * 60 * 24 * 7; // 7 jours
  return jwt.sign({ userId, userName }, privateKey, { algorithm: 'RS256', expiresIn });
};

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.username);
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function checkPass(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user.id, user.username);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  loginUser,
  checkPass
};
require('dotenv').config();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utiliser un secret partagé pour signer les tokens
const secretKey = process.env.JWT_SECRET;

function generateToken(id, fullName) {
  return jwt.sign({ id, fullName }, 'yourSecretKey', { expiresIn: '1h' });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  console.log('Login request received:', email);

  try {
    const user = await User.findOne({ where: { email } });
    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.full_name);
    console.log('Generated token:', token);

    res.status(200).json({ token });
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

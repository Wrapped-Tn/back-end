const User = require('../models/User.js');

// Créer un utilisateur
const createUser = async (req, res) => {
  const { email, password, full_name, phone_number } = req.body;

  try {
    const newUser = await User.create({ email, password, full_name, phone_number });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Lire les informations d'un utilisateur
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone_number } = req.body;

  try {
    const user = await User.findByPk(id);
    if (user) {
      user.full_name = full_name || user.full_name;
      user.phone_number = phone_number || user.phone_number;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};

const bcrypt = require('bcrypt'); // Importer bcryptjs
const User = require('../models/User.js');
const moment = require('moment'); // Import moment for date formatting

// Créer un utilisateur
const createUser = async (req, res) => {
  const { email, password, full_name, phone_number, sexe, grade, profile_picture_url, region, birthdate, user_type } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone_number,
      sexe,
      profile_picture_url:"",
      grade,
      region,
      birthdate,
      user_type: user_type || 'regular', // Ensure the correct or default value for user_type
      commission_earned: req.body.commission_earned || 0,
    });

    res.status(200).json({ id: newUser.id });
  } catch (error) {
    console.error(error);
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
// Tous les users
const getAllUser = async (req, res) => {

  try {
    const user = await User.findAll();
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
  getAllUser
};

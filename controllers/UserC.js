const bcrypt = require('bcrypt'); // Importer bcryptjs
const User = require('../models/User.js');
const Grade = require('../models/Grade.js');

const moment = require('moment'); // Import moment for date formatting

// Créer un utilisateur
const createUserWithGrade = async (req, res) => {
  const { email, password, full_name, phone_number, sexe, profile_picture_url, region, birthdate, user_type } = req.body;

  try {
    // Create the default grade
    const newGrade = await Grade.create({
      grade_name: 'Débutant',  // Default grade name
      min_stars: 0,            // Set to 0
      max_stars: 100,          // Upper limit for the "Débutant" grade
      min_sales: 0,            // Set to 0
      max_sales: 10,           // Upper limit for the "Débutant" grade
      rewards: 'Badge, accès aux statistiques de ses recommandations',  // Rewards for "Débutant"
    });

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the new grade ID
    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone_number,
      sexe,
      profile_picture_url: profile_picture_url || "",  // Default to empty if not provided
      grade_id: newGrade.id,  // Use the ID of the newly created grade
      region,
      birthdate,
      user_type: user_type || 'regular', // Default to 'regular' if not provided
      commission_earned: req.body.commission_earned || 0,
    });

    res.status(200).json({ id: newUser.id, gradeId: newGrade.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user with grade' });
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

const getUserCart = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json({
        grade: user.grade_id,
        full_name: user.full_name,
        profile_picture_url: user.profile_picture_url
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};


module.exports = {
  createUserWithGrade,
  getUserById,
  updateUser,
  deleteUser,
  getAllUser,
  getUserCart
};

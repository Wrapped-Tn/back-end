const bcrypt = require('bcrypt'); // Importer bcrypt
const User = require('../models/User.js');
const Grade = require('../models/Grade.js');
const Auth = require('../models/Auth.js');
const moment = require('moment'); // Importer moment pour le formatage des dates

// Créer un utilisateur avec grade et auth
const createUserWithGrade = async (req, res) => {
  const {
    email,
    password,
    full_name,
    phone_number,
    sexe,
    profile_picture_url,
    region,
    birthdate,
    user_type,
  } = req.body;

  try {
    // Créer le grade par défaut
    const newGrade = await Grade.create({
      grade_name: 'Débutant',
      min_stars: 0,
      max_stars: 100,
      min_sales: 0,
      max_sales: 10,
      rewards: 'Badge, accès aux statistiques de ses recommandations',
    });

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur lié à Auth
    const newUser = await User.create({
      full_name,
      grade_id: newGrade.id,
      birthdate,
      sexe,
      user_type: user_type || 'regular',
      commission_earned: req.body.commission_earned || 0,
    });
    // Créer l'entrée Auth
    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      phone_number,
      profile_picture_url: profile_picture_url || '',
      region,
      role: 'user',
      users_id:newUser.id
    });


    res.status(200).json({ userId: newUser.id, gradeId: newGrade.id, authId: newAuth.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user with grade and auth' });
  }
};

// Lire les informations d'un utilisateur
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Récupérer tous les utilisateurs
const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Auth }],
    });
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone_number, region } = req.body;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      user.full_name = full_name || user.full_name;
      await user.save();

      if (user.Auth) {
        user.Auth.phone_number = phone_number || user.Auth.phone_number;
        user.Auth.region = region || user.Auth.region;
        await user.Auth.save();
      }

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
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      if (user.Auth) {
        await user.Auth.destroy();
      }
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Récupérer le panier d'un utilisateur
const getUserCart = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      res.status(200).json({
        grade: user.grade_id,
        full_name: user.full_name,
        profile_picture_url: user.Auth?.profile_picture_url || '',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = {
  createUserWithGrade,
  getUserById,
  updateUser,
  deleteUser,
  getAllUser,
  getUserCart,
};

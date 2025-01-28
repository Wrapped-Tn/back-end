const Rating = require('../models/Rating.js');

// Créer une évaluation
const createRating = async (req, res) => {
  const { user_id, seller_id, score, comment, rating_date } = req.body;

  try {
    const newRating = await Rating.create({
      user_id,
      seller_id,
      score,
      comment,
      rating_date
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rating' });
  }
};

// Récupérer une évaluation par ID
const getRatingById = async (req, res) => {
  const { id } = req.params;

  try {
    const rating = await Rating.findByPk(id);
    if (rating) {
      res.status(200).json(rating);
    } else {
      res.status(404).json({ error: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rating' });
  }
};

// Récupérer toutes les évaluations
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll();
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ratings' });
  }
};

// Mettre à jour une évaluation
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { score, comment } = req.body;

  try {
    const rating = await Rating.findByPk(id);
    if (rating) {
      rating.score = score || rating.score;
      rating.comment = comment || rating.comment;
      await rating.save();
      res.status(200).json(rating);
    } else {
      res.status(404).json({ error: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

// Supprimer une évaluation
const deleteRating = async (req, res) => {
  const { id } = req.params;

  try {
    const rating = await Rating.findByPk(id);
    if (rating) {
      await rating.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rating' });
  }
};

module.exports = {
  createRating,
  getRatingById,
  getAllRatings,
  updateRating,
  deleteRating,
};

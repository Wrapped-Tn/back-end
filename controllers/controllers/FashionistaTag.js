const FashionistaTag = require('../models/FashionistaTag.js');

// Créer un tag Fashionista
const createFashionistaTag = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newTag = await FashionistaTag.create({ name, description });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fashionista tag' });
  }
};

// Récupérer un tag Fashionista par ID
const getFashionistaTagById = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await FashionistaTag.findByPk(id);
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({ error: 'Fashionista tag not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve fashionista tag' });
  }
};

// Récupérer tous les tags Fashionista
const getAllFashionistaTags = async (req, res) => {
  try {
    const tags = await FashionistaTag.findAll();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve fashionista tags' });
  }
};

// Mettre à jour un tag Fashionista
const updateFashionistaTag = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const tag = await FashionistaTag.findByPk(id);
    if (tag) {
      tag.name = name || tag.name;
      tag.description = description || tag.description;
      await tag.save();
      res.status(200).json(tag);
    } else {
      res.status(404).json({ error: 'Fashionista tag not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fashionista tag' });
  }
};

// Supprimer un tag Fashionista
const deleteFashionistaTag = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await FashionistaTag.findByPk(id);
    if (tag) {
      await tag.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Fashionista tag not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fashionista tag' });
  }
};

module.exports = {
  createFashionistaTag,
  getFashionistaTagById,
  getAllFashionistaTags,
  updateFashionistaTag,
  deleteFashionistaTag,
};

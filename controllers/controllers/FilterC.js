const Filter = require('../models/Filter.js');

// Créer un filtre
const createFilter = async (req, res) => {
  const { name, filter_type, prix_filter } = req.body;

  try {
    const newFilter = await Filter.create({ name, filter_type, prix_filter });
    res.status(201).json(newFilter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create filter' });
  }
};

// Lire un filtre
const getFilterById = async (req, res) => {
  const { id } = req.params;

  try {
    const filter = await Filter.findByPk(id);
    if (filter) {
      res.status(200).json(filter);
    } else {
      res.status(404).json({ error: 'Filter not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve filter' });
  }
};

// Mettre à jour un filtre
const updateFilter = async (req, res) => {
  const { id } = req.params;
  const { name, filter_type, prix_filter } = req.body;

  try {
    const filter = await Filter.findByPk(id);
    if (filter) {
      filter.name = name || filter.name;
      filter.filter_type = filter_type || filter.filter_type;
      filter.prix_filter = prix_filter || filter.prix_filter;
      await filter.save();
      res.status(200).json(filter);
    } else {
      res.status(404).json({ error: 'Filter not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update filter' });
  }
};

// Supprimer un filtre
const deleteFilter = async (req, res) => {
  const { id } = req.params;

  try {
    const filter = await Filter.findByPk(id);
    if (filter) {
      await filter.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Filter not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete filter' });
  }
};

module.exports = {
  createFilter,
  getFilterById,
  updateFilter,
  deleteFilter,
};

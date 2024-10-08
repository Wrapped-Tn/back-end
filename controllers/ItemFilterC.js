const ItemFilter = require('../models/ItemFilter.js');

// Créer une association article-filtre
const createItemFilter = async (req, res) => {
  const { item_id, filter_value_id } = req.body;

  try {
    const newItemFilter = await ItemFilter.create({ item_id, filter_value_id });
    res.status(201).json(newItemFilter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item filter association' });
  }
};

// Lire une association article-filtre
const getItemFilterById = async (req, res) => {
  const { id } = req.params;

  try {
    const itemFilter = await ItemFilter.findByPk(id);
    if (itemFilter) {
      res.status(200).json(itemFilter);
    } else {
      res.status(404).json({ error: 'Item filter association not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve item filter association' });
  }
};

// Mettre à jour une association article-filtre
const updateItemFilter = async (req, res) => {
  const { id } = req.params;
  const { item_id, filter_value_id } = req.body;

  try {
    const itemFilter = await ItemFilter.findByPk(id);
    if (itemFilter) {
      itemFilter.item_id = item_id || itemFilter.item_id;
      itemFilter.filter_value_id = filter_value_id || itemFilter.filter_value_id;
      await itemFilter.save();
      res.status(200).json(itemFilter);
    } else {
      res.status(404).json({ error: 'Item filter association not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item filter association' });
  }
};

// Supprimer une association article-filtre
const deleteItemFilter = async (req, res) => {
  const { id } = req.params;

  try {
    const itemFilter = await ItemFilter.findByPk(id);
    if (itemFilter) {
      await itemFilter.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Item filter association not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item filter association' });
  }
};

module.exports = {
  createItemFilter,
  getItemFilterById,
  updateItemFilter,
  deleteItemFilter,
};

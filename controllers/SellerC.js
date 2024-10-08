const Seller = require('../models/Seller.js');

// Créer un vendeur
const createSeller = async (req, res) => {
  const { user_id, company_name, description, store_location } = req.body;

  try {
    const newSeller = await Seller.create({ user_id, company_name, description, store_location });
    res.status(201).json(newSeller);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create seller' });
  }
};

// Lire les informations d'un vendeur
const getSellerById = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Seller.findByPk(id);
    if (seller) {
      res.status(200).json(seller);
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve seller' });
  }
};

// Mettre à jour un vendeur
const updateSeller = async (req, res) => {
  const { id } = req.params;
  const { company_name, description, store_location } = req.body;

  try {
    const seller = await Seller.findByPk(id);
    if (seller) {
      seller.company_name = company_name || seller.company_name;
      seller.description = description || seller.description;
      seller.store_location = store_location || seller.store_location;
      await seller.save();
      res.status(200).json(seller);
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update seller' });
  }
};

// Supprimer un vendeur
const deleteSeller = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await Seller.findByPk(id);
    if (seller) {
      await seller.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete seller' });
  }
};

module.exports = {
  createSeller,
  getSellerById,
  updateSeller,
  deleteSeller,
};

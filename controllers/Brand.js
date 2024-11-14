const Brand = require('../models/Brand.js');

// Créer un vendeur
const createBrand = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const newBrand = await Brand.create({ name, email, phone, address });
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Brand' });
  }
};

// Récupérer un vendeur par ID
const getBrandById = async (req, res) => {
  const { id } = req.params;

  try {
    const Brand = await Brand.findByPk(id);
    if (Brand) {
      res.status(200).json(Brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Brand' });
  }
};

// Récupérer tous les vendeurs
const getAllBrands = async (req, res) => {
  try {
    const Brands = await Brand.findAll();
    res.status(200).json(Brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve Brands' });
  }
};

// Mettre à jour un vendeur
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const Brand = await Brand.findByPk(id);
    if (Brand) {
      Brand.name = name || Brand.name;
      Brand.email = email || Brand.email;
      Brand.phone = phone || Brand.phone;
      Brand.address = address || Brand.address;
      await Brand.save();
      res.status(200).json(Brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Brand' });
  }
};

// Supprimer un vendeur
const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const Brand = await Brand.findByPk(id);
    if (Brand) {
      await Brand.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Brand' });
  }
};

module.exports = {
  createBrand,
  getBrandById,
  getAllBrands,
  updateBrand,
  deleteBrand,
};

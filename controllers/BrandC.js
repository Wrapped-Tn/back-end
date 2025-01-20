const Brand = require('../models/Brand.js');
const Auth = require('../models/Auth.js');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Créer un vendeur
const createBrand = async (req, res) => {
  const { email, password, brand_name, profile_picture_url, region,phone_number } = req.body;

  try {
    // Vérifier si tous les champs nécessaires sont fournis
    if (!email || !password || !brand_name ) {
      return res.status(400).json({ error: 'Email, password, brand_name, and profile_picture_url are required.' });
    }

    // Générer un mot de passe haché
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Créer une marque liée à l'entrée Auth
    const newBrand = await Brand.create({
      brand_name,
      profile_picture_url,  // Associer le profile_picture_url à la marque
      accountLevel:'free',  // Niveau par défaut si non fourni
    });
    // Créer une entrée Auth pour le vendeur
    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      profile_picture_url:profile_picture_url|| '',  // Utiliser profile_picture_url
      region: region || '',  // En cas de valeur vide
      phone_number:phone_number,
      role: 'brand',
      users_id:newBrand.id
    });


    // Répondre avec un succès
    res.status(201).json({
      message: 'Brand created successfully!',
      brandId: newBrand.id,
      authId: newAuth.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create brand' });
  }
};

// Récupérer un vendeur par ID
const getBrandById = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id, {
      include: {
        model: Auth,
        attributes: ['email', 'role'], // Inclure les détails d'authentification
      },
    });

    if (brand) {
      res.status(200).json(brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brand' });
  }
};

// Récupérer tous les vendeurs
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      include: {
        model: Auth,
        attributes: ['email', 'role'],
      },
    });

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

// Mettre à jour un vendeur
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brand_name, logo_url, accountLevel, email, password } = req.body;

  try {
    const brand = await Brand.findByPk(id, {
      include: { model: Auth },
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Mettre à jour les détails de la marque
    brand.brand_name = brand_name || brand.brand_name;
    brand.logo_url = logo_url || brand.logo_url;
    brand.accountLevel = accountLevel || brand.accountLevel;
    await brand.save();

    // Mettre à jour les détails d'authentification
    if (email || password) {
      const auth = await Auth.findByPk(brand.auth_id);

      if (email) auth.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        auth.password = await bcrypt.hash(password, salt);
      }

      await auth.save();
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

// Supprimer un vendeur
const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Supprimer la marque et son entrée Auth associée
    const auth = await Auth.findByPk(brand.auth_id);
    await auth.destroy();
    await brand.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};
const getBrandCart = async (req, res) => {
  const { idbrand,idauth } = req.body; // ID du vendeur transmis dans l'URL

  try {
    // Récupérer la marque avec l'authentification associée
    const brand = await Brand.findByPk(idbrand);
    const auth=await Auth.findByPk(idauth)
    if (brand) {
      res.status(200).json({
        brand_name: brand.brand_name,
        account_level: brand.accountLevel,
        total_sales: brand.total_sales,
        profile_picture_url: auth.profile_picture_url || '', // Photo de profil
      });
    } else {
      res.status(404).json({ message: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};


const getNamesBrand = async (req, res) => {
  const { search } = req.query;

  try {
    const brands = await Brand.findAll({
      attributes: ['id', 'brand_name'],
      where: search
        ? { brand_name: { [Op.like]: `${search}%` } } // Recherche commençant par les lettres
        : {},
    });

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

module.exports = {
  createBrand,
  getBrandById,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandCart,
  getNamesBrand
};

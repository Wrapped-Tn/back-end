const Article = require('../models/Article.js');
const Brand = require('../models/Brand.js');
const Filter = require('../models/Filter.js');
const Post = require('../models/Post.js');
const PostImage = require('../models/PostImage.js');
const PostPosition = require('../models/PostPosition.js');

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


const getItemsFilter = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['occasion'],
      include: [{
        model: PostImage,
        required: false,
        include: [{
          model: PostPosition,
          attributes: ['brand', 'category', 'size'],
          required: false
        }]
      }]
    });

    const articles = await Article.findAll({
      attributes: ['color', 'category', 'taille_disponible', 'type_clothes']
    });

    const brands = await Brand.findAll({
      attributes: ['brand_name', 'id']
    });

    if (!posts.length && !articles.length && !brands.length) {
      return res.status(404).json({ error: "Filter not found" });
    }

    // Suppression des doublons et mise à plat des données
    const occasions = [...new Set(posts.map(post => post?.occasion).filter(Boolean))];

    const colors = [...new Set(articles.flatMap(article => article?.color || []).filter(Boolean))];

    const genders = [...new Set(articles.map(article => article?.category).filter(Boolean))];

    const clothesTypes = [...new Set([
      ...articles.map(article => article?.type_clothes).filter(Boolean),
      ...posts.flatMap(post =>
        (post.PostImages || []).flatMap(img => img?.PostPosition?.category).filter(Boolean)
      )
    ])];

    // Normalisation des tailles
    const sizes = [...new Set(
      articles.flatMap(article => article?.taille_disponible?.split(',').map(s => s.trim().toUpperCase()) || [])
      .concat(posts.flatMap(post =>
        (post.PostImages || []).flatMap(img => img?.PostPosition?.size?.split(',').map(s => s.trim().toUpperCase()) || [])
      ))
    )];

    const itemBrands = [...new Set(
      posts.flatMap(post =>
        (post.PostImages || []).flatMap(img => img?.PostPosition?.brand).filter(Boolean)
      )
    )];

    const registeredBrands = brands.map(brand => brand.brand_name);

    res.status(200).json({
      occasions,
      colors,
      genders,
      clothesTypes,
      sizes,
      itemBrands,
      registeredBrands
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des filtres :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des filtres." });
  }
};



module.exports = {
  createFilter,
  getFilterById,
  updateFilter,
  deleteFilter,
  getItemsFilter,
};

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
    });

    const postPos = await PostPosition.findAll({
      attributes: ['brand', 'category', 'size'],
    });

    const brands = await Brand.findAll({
      attributes: ['brand_name'],
    });

    const articles = await Article.findAll({
      attributes: ['color', 'category', 'taille_disponible', 'type_clothes']
    });

    // Fonction pour supprimer les doublons et valeurs nulles
    const uniqueValues = (arr) => [...new Set(arr.filter(Boolean))];

    // Extraction et nettoyage des données
    const occasions = uniqueValues(posts.flatMap(post => post.occasion || []));

    const colors = uniqueValues(articles.flatMap(article => article.color || []));

    const sizes = uniqueValues([
      ...articles.flatMap(article => article.taille_disponible?.split(',').map(s => s.trim().toUpperCase()) || []),
      ...postPos.flatMap(pos => pos.size?.split(',').map(s => s.trim().toUpperCase()) || [])
    ]);

    const clothesTypes = uniqueValues([
      ...articles.map(article => article.type_clothes),
      ...postPos.map(pos => pos.category)
    ]);

    const genders = uniqueValues(articles.map(article => article.category));

    const itemBrands = uniqueValues([
      ...brands.map(brand => brand.brand_name),
      ...postPos.map(pos => pos.brand?.trim()) // Suppression des espaces inutiles
    ]);

    res.status(200).json({
      occasions,
      colors,
      sizes,
      clothesTypes,
      genders,
      itemBrands
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des filtres :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des filtres." });
  }
};

// const getItemsFilter = async (req, res) => {
//   try {

//     const posts=await Post.findAll({
//       attributes: ['occasion'],
//     })
//     const postPos=await PostPosition({
//       attributes: ['brand', 'category', 'size'],
//     })
//      const brands = await Brand.findAll({
//       attributes: ['brand_name', 'id']
//     });
//     const articles = await Article.findAll({
//       attributes: ['color', 'category', 'taille_disponible', 'type_clothes']
//     });

//     const occasions=posts
//     // const colors=
//     // const genders=
//     // const clothesTypes=
//     // const sizes=
//     // const itemBrands=
//     // const registeredBrands=




//     // const posts = await Post.findAll({
//     //   attributes: ['occasion'],
//     //   include: [{
//     //     model: PostImage,
//     //     required: false,
//     //     include: [{
//     //       model: PostPosition,
//     //       attributes: ['brand', 'category', 'size'],
//     //       required: false
//     //     }]
//     //   }]
//     // });

//     // const articles = await Article.findAll({
//     //   attributes: ['color', 'category', 'taille_disponible', 'type_clothes']
//     // });

//     // const brands = await Brand.findAll({
//     //   attributes: ['brand_name', 'id']
//     // });

//     // if (!posts.length && !articles.length && !brands.length) {
//     //   return res.status(404).json({ error: "Filter not found" });
//     // }

//     // // Suppression des doublons et nettoyage des valeurs nulles
//     // const uniqueValues = (arr) => [...new Set(arr.filter(Boolean))];

//     // const occasions = uniqueValues(posts.map(post => post.occasion));

//     // const colors = uniqueValues(articles.flatMap(article => article.color || []));

//     // const genders = uniqueValues(articles.map(article => article.category));

//     // const clothesTypes = uniqueValues([
//     //   ...articles.map(article => article.type_clothes),
//     //   ...posts.flatMap(post =>
//     //     (post.PostImages || []).flatMap(img => img.PostPosition?.category)
//     //   )
//     // ]);

//     // const sizes = uniqueValues([
//     //   ...articles.flatMap(article => article.taille_disponible?.split(',').map(s => s.trim().toUpperCase()) || []),
//     //   ...posts.flatMap(post =>
//     //     (post.PostImages || []).flatMap(img => img.PostPosition?.size?.split(',').map(s => s.trim().toUpperCase()) || [])
//     //   )
//     // ]);

//     // const itemBrands = uniqueValues(
//     //   posts.flatMap(post =>
//     //     (post.PostImages || []).flatMap(img => img.PostPosition?.brand)
//     //   )
//     // );

//     // const registeredBrands = brands.map(brand => brand.brand_name);

//     res.status(200).json({
//       occasions,
//       colors,
//       genders,
//       clothesTypes,
//       sizes,
//       itemBrands,
//       registeredBrands
//     });

//   } catch (error) {
//     console.error("Erreur lors de la récupération des filtres :", error);
//     res.status(500).json({ error: "Erreur lors de la récupération des filtres." });
//   }
// };


module.exports = {
  createFilter,
  getFilterById,
  updateFilter,
  deleteFilter,
  getItemsFilter,
};

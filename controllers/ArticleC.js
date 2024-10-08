const Article = require('../models/Article.js');

// Créer un article
const createArticle = async (req, res) => {
  const { seller_id, title, description, price, category, brand, color, size, available_stock, images } = req.body;

  try {
    const newArticle = await Article.create({ seller_id, title, description, price, category, brand, color, size, available_stock, images });
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};

// Lire un article
const getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByPk(id);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve article' });
  }
};

// Mettre à jour un article
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, brand, color, size, available_stock } = req.body;

  try {
    const article = await Article.findByPk(id);
    if (article) {
      article.title = title || article.title;
      article.description = description || article.description;
      article.price = price || article.price;
      article.category = category || article.category;
      article.brand = brand || article.brand;
      article.color = color || article.color;
      article.size = size || article.size;
      article.available_stock = available_stock || article.available_stock;
      await article.save();
      res.status(200).json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};

// Supprimer un article
const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByPk(id);
    if (article) {
      await article.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};

module.exports = {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
};

const express = require('express');
const {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getAllArticles
} = require('../controllers/ArticleC');

const router = express.Router();

// Créer un article
router.post('/', createArticle);

// Lire un article par ID
router.get('/:id', getArticleById);

// Lire toutes les articles article par ID
router.get('/', getAllArticles);;

// Mettre à jour un article
router.put('/:id', updateArticle);

// Supprimer un article
router.delete('/:id', deleteArticle);

module.exports = router;

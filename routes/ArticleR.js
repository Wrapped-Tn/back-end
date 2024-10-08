const express = require('express');
const {
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/ArticleC');

const router = express.Router();

// Créer un article
router.post('/', createArticle);

// Lire un article par ID
router.get('/:id', getArticleById);

// Mettre à jour un article
router.put('/:id', updateArticle);

// Supprimer un article
router.delete('/:id', deleteArticle);

module.exports = router;

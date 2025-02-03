const express = require('express');
const router = express.Router();
const ArticleC = require('../controllers/ArticleC');

// Route pour créer un nouvel article
router.post('/articles', ArticleC.createArticle);

module.exports = router;

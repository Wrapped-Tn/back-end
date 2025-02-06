const express = require('express');
const router = express.Router();
const ArticleC = require('../controllers/ArticleC');

// Route pour créer un nouvel article
router.post('/articles', ArticleC.createArticle);
router.get('/articles/:post_id', ArticleC.getByPostId);

module.exports = router;

const express = require('express');
const router = express.Router();
const ArticleC = require('../controllers/ArticleC');

// Route pour créer un nouvel article
router.post('/articles', ArticleC.createArticle);
router.get('/articles/:post_id', ArticleC.getByPostId);
router.get('/getprices',ArticleC.getMinMaxPrice);
// Added By Youssef
router.delete('/articles/:id', ArticleC.deleteArticle);
// End Added By Youssef
router.get('/getprices',ArticleC.getMinMaxPrice)

module.exports = router;

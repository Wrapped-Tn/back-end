const express = require('express');
const { getArticlesLikedByUser, addLike, deleteLike } = require('../controllers/Likes');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching liked articles for user:', userId);

    const likedArticles = await getArticlesLikedByUser(userId);
    res.json(likedArticles);
  } catch (error) {
    console.error('Error fetching liked articles:', error);
    res.status(500).json({ error: error.message });
  }
});


router.post('/', async (req, res) => {
  const { userId, articleId } = req.body;
  const like = await addLike(userId, articleId);
  res.json(like);
});

router.delete('/', async (req, res) => {
  const { userId, articleId } = req.body;
  await deleteLike(userId, articleId);
  res.sendStatus(204);
});

module.exports = router;

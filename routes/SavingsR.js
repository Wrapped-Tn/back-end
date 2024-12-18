const express = require('express');
const { getSavedArticlesByUser, addSaving, deleteSaving } = require('../controllers/Saved_Posts');
const router = express.Router();

router.get('/:id', async (req, res) => {
  const { userId } = req.params;
  const savings = await getSavedArticlesByUser(userId);
  res.json(savings);
});

router.post('/', async (req, res) => {
  const { userId, articleId } = req.body;
  const saving = await addSaving(userId, articleId);
  res.json(saving);
});

router.delete('/', async (req, res) => {
  const { userId, articleId } = req.body;
  await deleteSaving(userId, articleId);
  res.sendStatus(204);
});

module.exports = router;

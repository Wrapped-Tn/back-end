const express = require('express');
const router = express.Router();
const { getSavedPostsByUser, addSaving, deleteSaving } = require('../controllers/SavePostC');

// Get saved posts by user
router.get('/saved-posts/:userId', async (req, res) => {
  try {
    const savedPosts = await getSavedPostsByUser(req.params.userId);
    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save a post
router.post('/save-post', async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const savedPost = await addSaving(userId, postId);
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unsave a post
router.delete('/unsave-post', async (req, res) => {
  const { userId, postId } = req.body;
  try {
    const deletedCount = await deleteSaving(userId, postId);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Saved post not found.' });
    }
    res.status(200).json({ message: 'Post unsaved successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
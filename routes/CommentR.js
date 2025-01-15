const express = require('express');
const router = express.Router();
const { getCommentsByPost, addComment, deleteComment, updateComment } = require('../controllers/CommentC');

// Get all comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const comments = await getCommentsByPost(req.params.postId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a post
router.post('/posts/:postId/comments', async (req, res) => {
  const { userId, content } = req.body;
  try {
    const comment = await addComment(userId, req.params.postId, content);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a comment
router.delete('/comments/:commentId', async (req, res) => {
  try {
    const deletedCount = await deleteComment(req.params.commentId);
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a comment
router.put('/comments/:commentId', async (req, res) => {
  const { content } = req.body;
  try {
    const updatedCount = await updateComment(req.params.commentId, content);
    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    res.status(200).json({ message: 'Comment updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
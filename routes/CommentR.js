const express = require('express');
const router = express.Router();
const CommentC = require('../controllers/CommentC');

// Get all comments for a post
router.get('/commentsbyPost/:postId', CommentC.getCommentsByPost);

// Add a comment to a post
router.post('/:postId/:userId', CommentC.addComment);

// Delete a comment
router.delete('/comments/:commentId', CommentC.deleteComment);

// Update a comment
router.put('/comments/:commentId', CommentC.updateComment);

module.exports = router;

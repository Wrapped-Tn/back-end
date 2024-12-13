const express = require('express');
const { getCommentsByArticle, addComment, deleteComment,updateComment } = require('../controllers/CommentsC');
const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id: articleId } = req.params; // Corrected destructuring
  try {
    const comments = await getCommentsByArticle(articleId);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching comments' });
  }
});


router.post('/', async (req, res) => {
  const { users_id, articles_id, content } = req.body;
  try {
    // Validation
    if (!users_id || !articles_id || !content || content.trim() === "") {
      return res.status(400).json({ error: 'User ID, Article ID, and Content are required and content cannot be empty' });
    }

    // Add the comment to the database using Sequelize
    const comment = await addComment(users_id, articles_id, content);

    // Respond with the newly added comment
    res.json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(500).json({ error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  const { id } = req.params;  
  try {
    const deleted = await deleteComment(id);
    if (deleted) {
      return res.status(200).json({ message: 'Comment deleted successfully' }); 
    } else {
      return res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: 'Content cannot be empty' });
  }

  try {
    // Log the ID to verify what is being passed
    console.log('Received ID:', id);

    // Fetch the comment by primary key
    const comment = await Comment.findByPk(id);

    // Check if the comment exists
    if (!comment) {
      console.log('Comment not found for ID:', id);
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Update content
    const [updated] = await Comment.update(
      { content: content },
      { where: { id: id } }
    );

    if (updated) {
      return res.status(200).json({ message: 'Comment updated successfully' });
    } else {
      return res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

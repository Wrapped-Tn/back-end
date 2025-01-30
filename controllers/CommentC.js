const Comment = require('../models/Comment');
const User = require('../models/User');
const Auth = require('../models/Auth');

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { post_id: postId },
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['full_name'],
          include: [
            {
              model: Auth,
              attributes: ['profile_picture_url'], // Fetch profile picture from Auth table
              where: { users_id: User.id }, // Ensure correct user relation
              required: false, // Allow users without an Auth record
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};

const addComment = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const { postId } = req.params;

    if (!userId || !content) {
      return res.status(400).json({ message: 'User ID and content are required.' });
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      user_id: userId,
      post_id: postId,
    });

    // Fetch comment with user details
    const commentWithUser = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['full_name'],
          include: [
            {
              model: Auth,
              attributes: ['profile_picture_url'],
              where: { users_id: userId },
              required: false,
            },
          ],
        },
      ],
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedCount = await Comment.destroy({ where: { id: commentId } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const [updatedCount] = await Comment.update(
      { content },
      { where: { id: commentId } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment updated successfully.' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment.' });
  }
};

module.exports = { getCommentsByPost, addComment, deleteComment, updateComment };

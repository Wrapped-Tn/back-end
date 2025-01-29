const Comment = require('../models/Comment');
const User = require('../models/User');
const Auth = require('../models/Auth');

const getCommentsByPost = async (postId) => {
  try {
    const comments = await Comment.findAll({
      where: { post_id: postId },
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['full_name', 'profile_picture_url'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

const addComment = async (userId, postId, content) => {
  try {
    // Create the comment
    const comment = await Comment.create({
      content: content,
      user_id: userId, 
      post_id: postId, 
    });

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
              attributes: ['profile_picture_url'], // Fetch the profile picture from the Auth table
              where: { users_id: userId }, // Ensure it is related to the correct user
            },
          ],
        },
      ],
    });

    return commentWithUser;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment.');
  }
};

const deleteComment = async (commentId) => {
  try {
    const deletedCount = await Comment.destroy({ where: { id: commentId } });
    return deletedCount;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment.');
  }
};

const updateComment = async (commentId, newContent) => {
  try {
    const [updatedCount] = await Comment.update(
      { content: newContent },
      { where: { id: commentId } }
    );
    return updatedCount;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw new Error('Failed to update comment.');
  }
};

module.exports = { getCommentsByPost, addComment, deleteComment, updateComment };
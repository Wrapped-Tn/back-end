// Updated by Youssef
const { SavePost } = require('../models/SavePost');
const { Post } = require('../models/Post');

const getSavedPostsByUser = async (userId) => {
  try {
    const savedPosts = await SavePost.findAll({
      where: { user_id: userId },
      include: [{ model: Post }],
    });
    return savedPosts;
  } catch (error) {
    console.error('Error retrieving saved posts:', error);
    throw new Error('Failed to retrieve saved posts.');
  }
};

const addSaving = async (userId, postId) => {
  try {
    const savedPost = await SavePost.create({ user_id: userId, post_id: postId });
    return savedPost;
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Failed to save the post.');
  }
};

const deleteSaving = async (userId, postId) => {
  try {
    const deletedCount = await SavePost.destroy({
      where: { user_id: userId, post_id: postId },
    });
    return deletedCount;
  } catch (error) {
    console.error('Error removing saved post:', error);
    throw new Error('Failed to remove the saved post.');
  }
};

module.exports = { getSavedPostsByUser, addSaving, deleteSaving };
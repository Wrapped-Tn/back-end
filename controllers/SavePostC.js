// Updated by Youssef
const SavePost = require('../models/SavePost');
const Post = require('../models/Post');

const getSavedPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const savedPosts = await SavePost.findAll({
      where: { user_id: userId },
      include: [{ model: Post }],
    });
    res.status(200).json(savedPosts);
  } catch (error) {
    console.error('Error retrieving saved posts:', error);
    res.status(500).json({ message: 'Failed to retrieve saved posts.' });
  }
};

const toggleSave = async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: 'Missing userId or postId' });
  }

  try {
    // Check if the post is already saved
    const existingSave = await SavePost.findOne({ where: { user_id: userId, post_id: postId } });

    if (existingSave) {
      // If saved, remove the save (unsave)
      await SavePost.destroy({ where: { user_id: userId, post_id: postId } });
      return res.status(200).json({ message: 'Post unsaved successfully.' });
    } else {
      // If not saved, add to saved posts
      await SavePost.create({ user_id: userId, post_id: postId, saveDate: new Date() });
      return res.status(201).json({ message: 'Post saved successfully.' });
    }
  } catch (error) {
    console.error('Error in saving/unsaving post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSavedPostsByUser, toggleSave };
const LikePost = require('../models/LikePost');
const Post = require('../models/Post');
const User = require('../models/User');


const getLikedPostsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const likedPosts = await LikePost.findAll({
            where: { users_id: user_id },
            include: { model: Post },
        });

        if (likedPosts.length === 0) {
            res.status(404).json({ error: 'No liked posts found' });
        }

        res.status(200).json(likedPosts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve liked posts' });
    }

};

const addLike = async (req, res) => {
    const user_id = parseInt(req.params.user_id, 10); // Ensure user_id is an integer
    const post_id = parseInt(req.params.post_id, 10); // Ensure post_id is an integer
  
    try {
      const newLike = await LikePost.create({
        user_id, // user_id is now an integer
        post_id, // post_id is now an integer
        likeDate: new Date(), // Use current timestamp for likeDate
      });
      res.status(201).json(newLike); // Return the newly created like
    } catch (error) {
      console.error('Error adding like:', error);
      res.status(500).json({ message: 'Failed to add like.' });
    }
}; 

const deleteLike = async (req, res) => {
    const user_id = parseInt(req.params.user_id, 10);  // Ensure user_id is an integer
    const post_id = parseInt(req.params.post_id, 10);  // Ensure post_id is an integer
  
    try {
      const deletedCount = await LikePost.destroy({
        where: {
          user_id,
          post_id,
        },
      });
  
      if (deletedCount === 0) {
        return res.status(404).json({ message: 'Like not found.' });
      }
  
      res.status(200).json({ message: 'Post unliked successfully.' });
    } catch (error) {
      console.error('Error removing like:', error);
      res.status(500).json({ message: 'Failed to remove like.' });
    }
};  

module.exports = { 
    getLikedPostsByUser,
    addLike,
    deleteLike
 };
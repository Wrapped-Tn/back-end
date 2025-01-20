const LikePost = require('../models/LikePost');
const Post = require('../models/Post');

const LikePostC = {

    getLikedPostsByUser: async (req, res) => {
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

    },

    addLike: async (req, res) => {
        const { user_id, post_id } = req.body;

        try {
            // Check if the user has already liked the post
            const existingLike = await LikePost.findOne({
                where: { user_id, post_id },
            });

            if (existingLike) {
                return res.status(400).json({ error: 'User has already liked this post' });
            }

            // Create the new like
            const newLike = await LikePost.create({ user_id, post_id });

            // Increment the likes_count in the Post model
            await Post.increment('likes_count', {
                where: { id: post_id },
                by: 1,
            });

            // Fetch the updated post details
            const postDetails = await Post.findOne({
                where: { id: post_id },
            });

            res.status(201).json({
                likeDetails: newLike,
                postDetails,
            });

        } catch (error) {
            console.error('Error adding like:', error);
            res.status(500).json({ error: 'Failed to add like' });
        }

    },

    deleteLike: async (req, res) => {
        const { user_id, post_id } = req.body;

        try {
            // Check if the user has liked the post
            const existingLike = await LikePost.findOne({
                where: { user_id, post_id },
            });

            if (!existingLike) {
                return res.status(404).json({ error: 'Like not found' });
            }

            // Delete the like
            await LikePost.destroy({
                where: { user_id, post_id },
            });

            // Decrement the likes_count in the Post model
            await Post.decrement('likes_count', {
                where: { id: post_id },
                by: 1,
            });

            // Fetch the updated post details
            const postDetails = await Post.findOne({
                where: { id: post_id },
            });

            res.status(200).json({ message: 'Like removed', postDetails });

        } catch (error) {
            console.error('Error deleting like:', error);
            res.status(500).json({ error: 'Failed to delete like' });
        }

    },
};

module.exports = { LikePostC };
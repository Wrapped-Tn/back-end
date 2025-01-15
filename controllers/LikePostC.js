// Added By Youssef
const LikePost = require('../models/LikePost');
const Post = require('../models/Post');

const likePostC = {

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

    }
};

model.exports = likePostC;

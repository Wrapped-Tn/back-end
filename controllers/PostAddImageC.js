// Added By Youssef
const PostImage = require('../models/PostImage');

const PostAddImageC = async (req, res) => {
    try {
        
        const { postId, url } = req.body;

        if (!url) return res.status(400).json({ error: 'Image URL is required.' });

        const postImage = await PostImage.create({
            post_id: postId,
            url,
        });

        res.status(201).json({ message: 'Image added successfully!', imageId: postImage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add image.' });
    }
};

module.exports = PostAddImageC;
// Added By Youssef
const PostPosition = require('../models/PostPosition');

const PostAddPositionC = async (req, res) => {
    try {
        
        const { imageId, x, y, brand, size, prix } = req.body;

        if(!imageId || x === undefined || y === undefined || !brand || !size || !prix) return res.status(400).json({ error: 'Required fields are missing.' });

        const postPosition = await PostPosition.create({
            post_image_id: imageId,
            x,
            y,
            brand,
            size,
            prix,
        });

        res.status(201).json({ message: 'Position added successfully!', postPosition });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add position.' });
    }
};

module.exports = PostAddPositionC;
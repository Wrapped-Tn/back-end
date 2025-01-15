// Added By Youssef
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const PostPosition = require('../models/PostPosition');

const LikePost = require('../models/LikePost');

// Add a post with images and positions
const addPost = async (req, res) => {
    try {
        const { userId, description, category, occasion, images } = req.body;

        // Validate required fields
        if (!userId || !category || !images || images.length === 0) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        // Parse category and occasion to arrays
        const parsedCategory = Array.isArray(category) ? category : category.split(',');
        const parsedOccasion = Array.isArray(occasion) ? occasion : (occasion ? occasion.split(',') : null);

        // Create post
        const post = await Post.create({
            user_id: userId,
            description: description || null,
            category: parsedCategory,
            occasion: parsedOccasion,
        });

        // Loop through images and positions
        for (const image of images) {
            if (!image.url || !Array.isArray(image.positions)) {
                return res.status(400).json({ error: 'Each image must have a URL and valid positions array.' });
            }

            // Create the image
            const postImage = await PostImage.create({
                post_id: post.id,
                url: image.url,
            });

            // Create positions for the image
            for (const position of image.positions) {
                if (
                    typeof position.x !== 'number' || 
                    typeof position.y !== 'number' || 
                    !position.brand || 
                    typeof position.size !== 'number' || 
                    typeof position.prix !== 'number'
                ) {
                    return res.status(400).json({ error: 'Invalid position data format.' });
                }

                await PostPosition.create({
                    post_image_id: postImage.id,
                    x: position.x,
                    y: position.y,
                    brand: position.brand,
                    size: position.size,
                    prix: position.prix,
                });
            }
        }

        res.status(201).json({ message: 'Post created successfully!', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to complete post creation.' });
    }
};
// Get all posts of a user
const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user.' });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve posts.' });
    }
};

// Get a post of a user
const getPostById = async (req, res) => {
    try {
        const { postId, userId } = req.params; 

        const post = await Post.findOne({
            where: { id: postId, user_id: userId }, 
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found for this user.' });
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve post.' });
    }
};

module.exports = {
    addPost,
    getUserPosts,
    getPostById,
};

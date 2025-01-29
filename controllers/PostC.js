// Added By Youssef
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const PostPosition = require('../models/PostPosition');
const User = require('../models/User');
const Auth = require('../models/Auth');
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');

require('dotenv').config();


// Configurer multer pour gérer les fichiers
const storage = multer.memoryStorage();  // Stocker temporairement en mémoire
const upload = multer({ storage: storage });


const LikePost = require('../models/LikePost');

// Configurer Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Add a post with images and positions
const addPost = async (req, res) => {
    try {
        const { userId, description, occasion, images } = req.body;

        // Validate required fields
        if (!userId || !images || images.length === 0) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        // Parse occasion into an array
        const parsedOccasion = Array.isArray(occasion) ? occasion : (occasion ? occasion.split(',') : null);

        // Create the post
        const post = await Post.create({
            user_id: userId,
            description: description || null,
            occasion: parsedOccasion,
        });

        // Process each image
        for (const image of images) {
            if (!image.url || !Array.isArray(image.positions)) {
                return res.status(400).json({ error: 'Each image must have a URL and valid positions array.' });
            }

            // Upload the image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(image.url, {
                folder: 'post_images',
            });

            // Create the image associated with the post
            const postImage = await PostImage.create({
                post_id: post.id,
                url: uploadResult.secure_url, // Secure URL returned by Cloudinary
            });

            // Process each position associated with this image
            for (const position of image.positions) {
                if (
                    !position.x || 
                    !position.y || 
                    !position.brand || 
                    !position.category || // Ensure category is provided
                    !position.size || 
                    !position.prix
                ) {
                    return res.status(400).json({ error: 'Invalid position data format.' });
                }

                // Create the position associated with the image
                await PostPosition.create({
                    post_image_id: postImage.id,
                    x: position.x,
                    y: position.y,
                    brand: position.brand,
                    category: position.category, // Add category here
                    size: position.size,
                    prix: position.prix,
                });
            }
        }

        res.status(201).json({ message: 'Post created successfully!', post, articleId: post.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to complete post creation.' });
    }
};





// Get all posts of a user 
const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10

        // Convert page and limit to numbers
        const offset = (page - 1) * limit;

        const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
            limit: parseInt(limit), // Number of posts to return
            offset: parseInt(offset), // Starting point for fetching posts
            order: [['createdAt', 'DESC']], // Optional: Order by creation date (newest first)
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

// Get all images of the posts of a user
const getMyWordrobes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10

        // Convert page and limit to numbers
        const offset = (page - 1) * limit;

        const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
            limit: parseInt(limit), // Number of posts to return
            offset: parseInt(offset), // Starting point for fetching posts
            order: [['createdAt', 'DESC']], // Optional: Order by creation date (newest first)
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user.' });
        }

        // Extract image URLs
        const imageUrls = posts.map(post => 
            post.PostImages.map(image => image.url)
        ).flat();
        // Extraction des IDs des posts
        const postIds = posts.map(post => post.id);
        res.status(200).json({ imageUrls ,postIds});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve posts.' });
    }
};

const deleteImages = async (req, res) => {
    try {
        const { userId } = req.params; // Récupérer l'ID de l'utilisateur
        const { imageUrls } = req.body; // Liste des URL des images à supprimer

        // Vérifier si les URLs sont fournies
        if (!imageUrls || imageUrls.length === 0) {
            return res.status(400).json({ message: 'No images provided to delete.' });
        }

        // Supprimer les images de Cloudinary
        const deletionPromises = imageUrls.map(url => {
            const publicId = url.split('/').pop().split('.')[0]; // Extraire l'ID public de l'URL
            return cloudinary.uploader.destroy(publicId); // Supprimer l'image sur Cloudinary
        });

        // Attendre que toutes les images soient supprimées
        await Promise.all(deletionPromises);

        // Suppression des images associées dans la base de données (si nécessaire)
        await PostImage.destroy({
            where: {
                url: imageUrls,
                PostId: userId, // S'assurer que les images appartiennent à l'utilisateur
            },
        });

        res.status(200).json({ message: 'Images deleted successfully from Cloudinary.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete images.' });
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
//Get WhatsHot Posts
const WhatsHotPosts = async (req, res) => {
    try {
        // Récupérer tous les posts avec leurs relations
        const posts = await Post.findAll({
            include: [
                {
                    model: PostImage,
                    as: 'PostImages', // Assurez-vous que cet alias est correct
                    include: [
                        {
                            model: PostPosition,
                            as: 'PostPositions', // Assurez-vous que cet alias est correct
                        }
                    ]
                },
                {
                    model: User,
                    as: 'user', // Assurez-vous que l'alias "user" correspond au modèle User dans votre association Sequelize
                    attributes: ['id', 'full_name']
                }
            ],
            attributes: ['id', 'description', 'createdAt','occasion','user_id'],
        });

        if (!posts || posts.length === 0) {
            return res.status(200).json({ message: 'No posts found.', posts: [] });
        }

        // Récupérer toutes les données d'authentification associées aux utilisateurs des posts
        const userIds = posts.map(post => post.user?.id).filter(Boolean);
        const authData = await Auth.findAll({
            where: {
                users_id: userIds
            },
            attributes: ['users_id', 'profile_picture_url']
        });

        // Mapper les données d'authentification par user_id pour un accès rapide
        const authMap = {};
        authData.forEach(auth => {
            authMap[auth.users_id] = auth.profile_picture_url;
        });

        // Formater les posts avec les informations complètes
        const formattedPosts = posts.map(post => {
            const occasion = post.occasion && Array.isArray(post.occasion) ? post.occasion : [];
            return {
                id: post.id,
                description: post.description,
                createdAt: post.createdAt,
                occasion: occasion,  // S'assurer que `occasion` n'est jamais undefined ou null
                user: {
                    fullName: post.user?.full_name || 'Unknown',
                    profilePicture: authMap[post.user?.id] || null
                },
                images: (post.PostImages || []).map(image => ({
                    id: image.id,
                    url: image.url,
                    positions: (image.PostPositions || []).map(position => ({
                        x: position.x,
                        y: position.y,
                        brand: position.brand,
                        category: position.category,
                        size: position.size,
                        prix: position.prix,
                        verified: position.verified
                    }))
                }))
            };
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve posts.' });
    }
};

module.exports = {
    addPost,
    getUserPosts,
    getPostById,
    getMyWordrobes,
    deleteImages,
    WhatsHotPosts
};

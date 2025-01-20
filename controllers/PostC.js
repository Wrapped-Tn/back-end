// Added By Youssef
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const PostPosition = require('../models/PostPosition');
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
        const { userId, description, category, occasion, images } = req.body;

        // Valider les champs obligatoires
        if (!userId || !category || !images || images.length === 0) {
            return res.status(400).json({ error: 'Required fields are missing.' });
        }

        // Parser category et occasion en tableaux
        const parsedCategory = Array.isArray(category) ? category : category.split(',');
        const parsedOccasion = Array.isArray(occasion) ? occasion : (occasion ? occasion.split(',') : null);

        // Créer le post
        const post = await Post.create({
            user_id: userId,
            description: description || null,
            category: parsedCategory,
            occasion: parsedOccasion,
        });

        // Traiter les images
        for (const image of images) {
            if (!image.url || !Array.isArray(image.positions)) {
                return res.status(400).json({ error: 'Each image must have a URL and valid positions array.' });
            }

            // Uploader l'image sur Cloudinary
            const uploadResult = await cloudinary.uploader.upload(image.url, {
                folder: 'post_images',
            });

            // Créer l'image associée au post
            const postImage = await PostImage.create({
                post_id: post.id,
                url: uploadResult.secure_url, // URL sécurisée renvoyée par Cloudinary
            });

            // Traiter les positions associées à cette image
            for (const position of image.positions) {
                if (
                    !position.x || 
                    !position.y || 
                    !position.brand || 
                    !position.size || 
                    !position.prix
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

const getMyWordrobes = async (req, res) => {
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
        })
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user.' });
        }
        // Extraction des URL des images
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
}
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





module.exports = {
    addPost,
    getUserPosts,
    getPostById,
    getMyWordrobes,
    deleteImages
};

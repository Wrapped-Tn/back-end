const { v2: cloudinary } = require('cloudinary');
const PostImage = require('../../models/PostImage');
const Auth = require('../../models/Auth');
require("dotenv").config();

// Configurer Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Créer un nouveau post avec une ou plusieurs images
const createPost = async (req, res) => {
    try {
        const { userId, content, imageUrls } = req.body;

        if (!imageUrls || !Array.isArray(imageUrls)) {
            return res.status(400).json({ message: 'Les URLs des images sont requises' });
        }

        // Upload des images
        const uploadedImages = [];
        for (const imageUrl of imageUrls) {
            const uploadResult = await cloudinary.uploader.upload(imageUrl, {
                folder: 'posts',
            });
            uploadedImages.push(uploadResult.secure_url);
        }

        // Créer le post
        const post = await PostImage.create({
            userId,
            content,
            images: uploadedImages,
        });

        res.status(201).json({ message: 'Post créé avec succès', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du post', error });
    }
};

// Lire tous les posts d'un utilisateur
const getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.findAll({ where: { userId }, include: User });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des posts', error });
    }
};

// Mettre à jour un post
const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }

        post.content = content || post.content;
        await post.save();

        res.status(200).json({ message: 'Post mis à jour avec succès', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du post', error });
    }
};

// Supprimer un post
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }

        await post.destroy();
        res.status(200).json({ message: 'Post supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du post', error });
    }
};

module.exports = { createPost, getPostsByUser, updatePost, deletePost };

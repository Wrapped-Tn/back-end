const Article = require('../models/Article');
const Brand =require('../models/Brand');
const Post = require('../models/Post');

const createArticle = async (req, res) => {
    try {
        // Récupération des données depuis le corps de la requête
        const { brand_id, post_id, color, disponibility, taille_disponible, category, type_clothes,price } = req.body;

        // Vérification des champs obligatoires
        if (!brand_id || !post_id || !color || !category || !type_clothes|| !price) {
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        // Création du nouvel article
        const newArticle = await Article.create({
            brand_id,
            post_id,
            color,
            disponibility,
            taille_disponible,
            category,
            type_clothes,
            price
        });

        return res.status(201).json({ message: "Article créé avec succès", article: newArticle });

    } catch (error) {
        console.error("Erreur lors de la création de l'article:", error);
        return res.status(500).json({ message: "Une erreur s'est produite", error: error.message });
    }
};

const getByPostId = async (req, res) => {
    try {
        const { post_id } = req.params;

        if (!post_id) {
            return res.status(400).json({ message: "L'ID du post est requis." });
        }

        // Récupérer les articles liés au post_id
        const articles = await Article.findAll({ where: { post_id } });

        if (articles.length === 0) {
            return res.status(404).json({ message: "Aucun article trouvé pour ce post." });
        }

        // Récupérer les IDs uniques des marques depuis les articles
        const brandIds = [...new Set(articles.map(article => article.brand_id))];

        // Récupérer les noms des marques depuis la table Brand
        const brands = await Brand.findAll({
            where: { id: brandIds },
            attributes: ['id', 'brand_name']
        });

        // Convertir en objet pour un accès rapide
        const brandMap = brands.reduce((acc, brand) => {
            acc[brand.id] = brand.brand_name;
            return acc;
        }, {});

        // Ajouter le nom de la marque à chaque article
        const articlesWithBrandName = articles.map(article => ({
            ...article.toJSON(),
            brand_name: brandMap[article.brand_id] || "Inconnu"
        }));

        return res.status(200).json(articlesWithBrandName);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
        return res.status(500).json({ message: "Une erreur s'est produite", error: error.message });
    }
};

const getMinMaxPrice = async (req, res) => {
    try {
        // Trouver le prix minimum et maximum parmi les articles
        const minPrice = await Article.min('price');
        const maxPrice = await Article.max('price');

        // Vérification si des prix ont été trouvés
        if (minPrice === null || maxPrice === null) {
            return res.status(404).json({ message: "Aucun article trouvé." });
        }


        return res.status(200).json({ minPrice, maxPrice });
    } catch (error) {
        console.error("Erreur lors de la récupération des prix:", error);
        return res.status(500).json({ message: "Une erreur s'est produite", error: error.message });
    }
};

// Added By Youssef
const deleteArticle = async (req, res) => {
    const { id } = req.params; // Get article ID from request params

    try {
        // Find the article first
        const article = await Article.findOne({ where: { id } });

        if (!article) {
            return res.status(404).json({ message: "Article non trouvé" });
        }

        // Extract the associated post ID
        const postId = article.post_id;

        // Delete the article
        await Article.destroy({ where: { id } });

        // If the article has an associated post, update the post
        if (postId) {
            await Post.update(
                { verified: false }, 
                { where: { id: postId } }
            );
        }

        res.status(200).json({ message: "Article supprimé avec succès et post dévalidé." });

    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ error: "Échec de la suppression de l'article" });
    }
};
// End Added By Youssef

module.exports = { createArticle, getByPostId, getMinMaxPrice, deleteArticle };


const Article = require('../models/Article');

const createArticle = async (req, res) => {
    try {
        // Récupération des données depuis le corps de la requête
        const { brand_id, post_id, color, disponibility, taille_disponible, category, type_clothes } = req.body;

        // Vérification des champs obligatoires
        if (!brand_id || !post_id || !color || !category || !type_clothes) {
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
            type_clothes
        });

        return res.status(201).json({ message: "Article créé avec succès", article: newArticle });

    } catch (error) {
        console.error("Erreur lors de la création de l'article:", error);
        return res.status(500).json({ message: "Une erreur s'est produite", error: error.message });
    }
};

module.exports = { createArticle };

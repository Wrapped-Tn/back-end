const Rating = require('../models/Rating');
const Brand = require('../models/Brand');

const calculateAverageRating = async (brandId) => {
    const ratings = await Rating.findAll({ where: { brandId } });

    if (ratings.length === 0) return null;

    const sum = ratings.reduce((total, r) => total + r.rating, 0);
    return (sum / ratings.length).toFixed(2);
};

const updateBrandRate = async (req, res) => {
    try {
        const { userId } = req.params;
        const { brandId, rating } = req.body;

        // Trouver ou créer un enregistrement
        const [existingRating, created] = await Rating.findOrCreate({
            where: { userId, brandId },
            defaults: { rating }
        });

        // Si l'enregistrement existait, on le met à jour
        if (!created) {
            existingRating.rating = rating;
            await existingRating.save();
        }

        // Recalculer et mettre à jour la moyenne des notes de la marque
        const newAverage = await calculateAverageRating(brandId);
        await Brand.update({ rating: newAverage }, { where: { id: brandId } });

        res.status(201).json({ message: created ? "Rating created" : "Rating updated", brandId, average: newAverage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the avg rating of a brand
const getAverageRating = async (req, res) => {
    try {
        const { brandId } = req.params;
        const brand = await Brand.findByPk(brandId, { attributes: ["rating"] });

        if (!brand) {
            return res.json({ brandId, average: 0 }); // Retourne 0 si la marque n'existe pas
        }

        res.json({ brandId, average: brand.rating || 0 }); // Retourne 0 si la note est `null`
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get user Rate on a specific brand
const getUserRating = async (req, res) => {
    try {
        const { brandId, userId } = req.params;

        const rating = await Rating.findOne({ where: { userId, brandId } });

        res.json({ brandId, userId, rating: rating ? rating.rating : 0 }); // Retourne 0 si aucune note trouvée
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    updateBrandRate,
    getAverageRating,
    getUserRating
};

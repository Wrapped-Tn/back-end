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

        // Check if the user already rated this brand
        let existingRating = await Rating.findOne({ where: { userId, brandId } });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            await Rating.create({ userId, brandId, rating });
        }

        // Recalculate and update the brand's average rating
        const newAverage = await calculateAverageRating(brandId);
        await Brand.update({ rating: newAverage }, { where: { id: brandId } });

        res.json({ message: "Rating updated", brandId, average: newAverage });
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
            return res.status(404).json({ message: "Brand not found" });
        }

        res.json({ brandId, average: brand.rating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user Rate on a specific brand
const getUserRating = async (req, res) => {
    try {
        const { brandId, userId } = req.params;

        const rating = await Rating.findOne({ where: { userId, brandId } });

        if (!rating) {
            return res.status(404).json({ message: "No rating found for this user and brand" });
        }

        res.json({ brandId, userId, rating: rating.rating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    updateBrandRate,
    getAverageRating,
    getUserRating
};
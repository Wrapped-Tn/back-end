const Rating = require('../models/Rating');

const updateBrandRate = async (req, res) => {
        try {
            const { brandId, rating } = req.body;
            const userId = req.user.id; // Assuming authentication middleware adds `req.user`

            // Check if the user already rated this brand
            let existingRating = await Rating.findOne({ where: { userId, brandId } });

            if (existingRating) {
                existingRating.rating = rating;
                await existingRating.save();
                return res.json({ message: "Rating updated", rating: existingRating });
            }

            // Create new rating
            const newRating = await Rating.create({ userId, brandId, rating });
            res.status(201).json({ message: "Rating added", rating: newRating });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

const getAverageRating = async (req, res) => {
        try {
            const { brandId } = req.params;
            const ratings = await Rating.findAll({ where: { brandId } });

            if (ratings.length === 0) {
                return res.json({ message: "No ratings yet", average: null });
            }

            const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
            res.json({ brandId, average: average.toFixed(2) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
};

const getUserRating = async (req, res) => {
        try {
            const { brandId } = req.params;
            const userId = req.user.id; // Assuming authentication middleware

            const rating = await Rating.findOne({ where: { userId, brandId } });

            if (!rating) {
                return res.status(404).json({ message: "No rating found" });
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

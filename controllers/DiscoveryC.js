const { Op } = require('sequelize');
const Brand = require('../models/Brand');
const User = require('../models/User');
const Article = require('../models/Article');
const PostPosition = require('../models/PostPosition');

const search = async (req, res) => {
    try {
        const query = req.query.q || ''; // For Search
        const { category, color, size, brand_name } = req.query; // For Filters

        const brandSearch = Brand.findAll({
            where: {
                [Op.and]: [
                    query ? { brand_name: { [Op.like]: `%${query}%` } } : {},
                    brand_name ? { brand_name: { [Op.like]: `%${brand_name}%` } } : {}
                ]
            },
            attributes: ['id', 'brand_name']
        });

        const userSearch = User.findAll({
            where: query ? { full_name: { [Op.like]: `%${query}%` } } : {},
            attributes: ['id', 'full_name']
        });

        const articleSearch = Article.findAll({
            where: {
                [Op.and]: [
                    query ? {
                        [Op.or]: [
                            { category: { [Op.like]: `%${query}%` } },
                            { type_clothes: { [Op.like]: `%${query}%` } },
                            { color: { [Op.like]: `%${query}%` } }
                        ]
                    } : {},
                    category ? { category: { [Op.like]: `%${category}%` } } : {},
                    color ? { color: { [Op.like]: `%${color}%` } } : {}
                ]
            },
            attributes: ['id', 'category', 'type_clothes', 'color']
        });

        const postSearch = PostPosition.findAll({
            where: {
                [Op.and]: [
                    query ? {
                        [Op.or]: [
                            { category: { [Op.like]: `%${query}%` } },
                            { size: { [Op.like]: `%${query}%` } }
                        ]
                    } : {},
                    category ? { category: { [Op.like]: `%${category}%` } } : {},
                    size ? { size: { [Op.like]: `%${size}%` } } : {}
                ]
            },
            attributes: ['id', 'category', 'size']
        });

        const [brands, users, articles, posts] = await Promise.all([
            brandSearch,
            userSearch,
            articleSearch,
            postSearch
        ]);

        res.json({ brands, users, articles, posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {search};

const { Op } = require('sequelize');
const Post = require('../models/Post');
const User = require('../models/User');
const PostPosition = require('../models/PostPosition');
const Article = require('../models/Article');
const PostImage = require('../models/PostImage');
const Brand = require('../models/Brand');

const search = async (req, res) => {
    try {
        const query = req.query.q || ''; // Search term like 'zara', 'black shoes', etc.
        const { category, size, brand_name } = req.query; // Optional filters

        // Search for posts matching the query in description, occasion, etc.
        const postSearch = await Post.findAll({
            distinct: true,
            where: {
                [Op.or]: [
                    { description: { [Op.like]: `%${query}%` } },
                    { occasion: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'description', 'occasion', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name'],
                    where: query ? { full_name: { [Op.like]: `%${query}%` } } : {},
                },
                {
                    model: PostImage,
                    as: 'PostImages', // Use the alias from the association
                    attributes: ['id', 'url'],
                    include: [
                        {
                            model: PostPosition,
                            as: 'PostPositions', // Use the alias from the association
                            attributes: ['brand_name', 'category', 'size', 'prix', 'verified'],
                            include: [
                                {
                                    model: Brand,
                                    as: 'brand',
                                    attributes: ['id', 'brand_name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        // Convert the result to plain JSON objects for easy processing
        const posts = postSearch.map(post => post.get({ plain: true }));

        // Filter and format the response data to include only specified attributes
        const filteredPosts = posts.map(post => {
            return {
                id: post.id,
                description: post.description,
                occasion: post.occasion,
                createdAt: post.createdAt,
                user: post.user ? { id: post.user.id, full_name: post.user.full_name } : null,
                PostImages: post.PostImages.map(image => {
                    return {
                        id: image.id,
                        url: image.url,
                        postPositions: image.PostPositions.map(position => {
                            return {
                                brand: position.brand ? { id: position.brand.id, brand_name: position.brand.brand_name } : null,
                                category: position.category,
                                size: position.size,
                                prix: position.prix,
                                verified: position.verified
                            };
                        })
                    };
                })
            };
        });

        res.status(200).json({ posts: filteredPosts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { search };

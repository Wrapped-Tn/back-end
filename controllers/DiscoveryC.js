const { Op } = require('sequelize');
const Post = require('../models/Post');
const User = require('../models/User');
const PostPosition = require('../models/PostPosition');
const Article = require('../models/Article');
const PostImage = require('../models/PostImage');
const Brand = require('../models/Brand');

const search = async (req, res) => {
    try {
        const query = req.query.q || ''; // Recherche générale
        const { category, size, brand_name, color, item, type_clothes, maxprice, minprice } = req.query; // Filtres

        const whereClause = {
            [Op.or]: [
                { description: { [Op.like]: `%${query}%` } },
                { occasion: { [Op.like]: `%${query}%` } }
            ]
        };

        // Ajout des filtres dynamiques
        const positionWhere = {};
        if (category) positionWhere.category = category;
        if (size) positionWhere.size = { [Op.like]: `%${size}%` };
        if (item) positionWhere.category = { [Op.like]: `%${item}%` };

        // Filtrage des prix dans PostPosition
        if (minprice) positionWhere.prix = { [Op.gte]: parseFloat(minprice) };
        if (maxprice) positionWhere.prix = { ...(positionWhere.prix || {}), [Op.lte]: parseFloat(maxprice) };

        const articleWhere = {};
        if (color) articleWhere.color = { [Op.substring]: color };
        if (type_clothes) articleWhere.type_clothes = { [Op.like]: `%${type_clothes}%` };
        if (size) articleWhere.taille_disponible = { [Op.substring]: size };
        if (item) articleWhere.category = { [Op.like]: `%${item}%` };

        // Filtrage des prix dans Article (si applicable)
        if (minprice) articleWhere.price = { [Op.gte]: parseFloat(minprice) };
        if (maxprice) articleWhere.price = { ...(articleWhere.price || {}), [Op.lte]: parseFloat(maxprice) };

        const brandWhere = {};
        if (brand_name) brandWhere.brand_name = { [Op.like]: `%${brand_name}%` };

        const postSearch = await Post.findAll({
            distinct: true,
            where: whereClause,
            attributes: ['id', 'description', 'occasion', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name']
                },
                {
                    model: PostImage,
                    as: 'PostImages',
                    attributes: ['id', 'url'],
                    include: [
                        {
                            model: PostPosition,
                            as: 'PostPositions',
                            attributes: ['brand_name', 'category', 'size', 'prix', 'verified'],
                            where: Object.keys(positionWhere).length ? positionWhere : undefined,
                            include: [
                                {
                                    model: Brand,
                                    as: 'brands',
                                    attributes: ['id', 'brand_name'],
                                    where: Object.keys(brandWhere).length ? brandWhere : undefined
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Article,
                    as: 'articles',
                    attributes: ['color', 'category', 'taille_disponible', 'type_clothes', 'price'],
                    where: Object.keys(articleWhere).length ? articleWhere : undefined
                }
            ]
        });

        const posts = postSearch.map(post => post.get({ plain: true }));

        const filteredPosts = posts.map(post => ({
            id: post.id,
            description: post.description,
            occasion: post.occasion,
            createdAt: post.createdAt,
            user: post.user ? { id: post.user.id, full_name: post.user.full_name } : null,
            PostImages: post.PostImages.map(image => ({
                id: image.id,
                url: image.url,
                postPositions: image.PostPositions.map(position => ({
                    brand: position.brand ? { id: position.brand.id, brand_name: position.brand.brand_name } : null,
                    category: position.category,
                    size: position.size,
                    prix: position.prix,
                    verified: position.verified
                }))
            })),
            articles: post.articles ? post.articles.map(article => ({
                color: article.color,
                category: article.category,
                size: article.taille_disponible,
                type_clothes: article.type_clothes,
                prix: article.price
            })) : []
        }));

        res.status(200).json({ posts: filteredPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { search };

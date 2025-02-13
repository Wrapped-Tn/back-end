const { Op } = require('sequelize');
const Post = require('../models/Post');
const User = require('../models/User');
const PostPosition = require('../models/PostPosition');
const Article = require('../models/Article');
const PostImage = require('../models/PostImage');
const sequelize = require('../config/config');

const search = async (req, res) => {
    try {
        const query = req.query.q || '';
        const { category, size, brand_name, color, type_clothes, maxprice, minprice, occasion } = req.query;

        // Base WHERE clause for Post
        const whereClause = {
            [Op.or]: [
                { description: { [Op.like]: `%${query}%` } },
                sequelize.where(
                    sequelize.json('occasion'),
                    sequelize.literal('JSON_CONTAINS(occasion, \'["' + occasion + '"]\')')
                )
            ]
        };

        // Filtres dynamiques pour PostPosition
        const positionWhere = {};
        if (category) positionWhere.category = category;
        if (size) positionWhere.size = { [Op.like]: `%${size}%` };
        if (type_clothes) positionWhere.category = { [Op.like]: `%${type_clothes}%` };
        if (minprice) positionWhere.prix = { [Op.gte]: parseFloat(minprice) };
        if (maxprice) positionWhere.prix = { ...(positionWhere.prix || {}), [Op.lte]: parseFloat(maxprice) };

        // Filtres dynamiques pour Article
        const articleWhere = {};
        if (color) articleWhere.color = { [Op.substring]: color };
        if (type_clothes) articleWhere.type_clothes = { [Op.like]: `%${type_clothes}%` };
        if (size) articleWhere.taille_disponible = { [Op.substring]: size };
        if (minprice) articleWhere.price = { [Op.gte]: parseFloat(minprice) };
        if (maxprice) articleWhere.price = { ...(articleWhere.price || {}), [Op.lte]: parseFloat(maxprice) };

        // Formater la clause de recherche (si aucun filtre n'est présent, récupérer tous les posts)
        const finalWhereClause = {
            ...whereClause,
            ...(category || size || brand_name || color || type_clothes || minprice || maxprice || occasion
                ? {} // Apply dynamic filters if any filter is present
                : {}) // Return all posts if no filter is applied
        };

        // Récupérer les posts avec les associations valides
        const postSearch = await Post.findAll({
            where: finalWhereClause,
            attributes: ['id', 'description', 'occasion', 'createdAt'],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                },
                {
                    model: PostImage,
                    as: 'PostImages',
                    attributes: ['id', 'url'],
                    include: [
                        {
                            model: PostPosition,
                            as: 'PostPositions',
                            attributes: ['category', 'size', 'prix', 'verified'],
                            where: positionWhere
                        }
                    ]
                },
                {
                    model: Article,
                    as: 'articles',
                    attributes: ['id', 'color', 'type_clothes', 'taille_disponible', 'price'],
                    where: articleWhere
                }
            ]
        });

        // Vérifier combien de posts sont trouvés
        console.log('Post search results:', postSearch.length);

        // Formater les résultats
        const formattedPosts = postSearch.map(post => {
            const occasion = post.occasion && Array.isArray(post.occasion) ? post.occasion : [];

            return {
                id: post.id,
                description: post.description,
                createdAt: post.createdAt,
                occasion: occasion,
                user: {
                    id_user: post.user?.id || null,
                },
                images: (post.PostImages || []).map(image => ({
                    id: image.id,
                    url: image.url,
                    positions: (image.PostPositions || []).map(position => ({
                        brand: position.brand,
                        category: position.category,
                        size: position.size,
                        prix: position.prix,
                        verified: position.verified
                    }))
                }))
            };
        });

        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const suggestions =async(req,res)=>{
    try{
        const user = await User.findAll({
            attributes: ['full_name'],
        })
        const post =await Post.findAll({
            attributes: ['description'],
        })
        if(!user && !post){
            return res.status(404).json({ message: 'No user or post found' });
        }
        const suggestions = user.map(user => user.full_name).concat(post.map(post => post.description));
        res.status(200).json({ suggestions });
    }catch(e){
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { search,suggestions};
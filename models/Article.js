const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const Brand = require('./Brand');
const Post = require('./Post');

const Article = sequelize.define('Article', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Brand,
            key: 'id',
        },
    },

    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'id',
        },
    },

    color: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },

    disponibility: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

    taille_disponible: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },

    category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },

    type_clothes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Article;
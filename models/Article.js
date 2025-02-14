const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const Brand = require('./Brand');
const Post = require('./Post');  // Vérifie que le modèle Post est correctement importé.

const Article = sequelize.define('article', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Brand,  // Correspond au nom de la table en base
            key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
    },

    // Updated by removing the ref
    post_id: {
        type: DataTypes.INTEGER
    },

    color: {
        type: DataTypes.JSON,  // Utiliser JSON pour stocker des tableaux
        allowNull: false,
    },

    disponibility: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },

    taille_disponible: {
        type: DataTypes.JSON,  // Utiliser JSON pour stocker des tableaux
        allowNull: true,
    },

    category: {
        type: DataTypes.JSON,  // Utiliser JSON pour stocker des tableaux
        allowNull: false,
    },

    type_clothes: {
        type: DataTypes.JSON,  // Utiliser JSON pour stocker des tableaux
        allowNull: false,
    },
    
    price:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

}, {
    tableName: 'Articles',
    timestamps: true
});

module.exports = Article;

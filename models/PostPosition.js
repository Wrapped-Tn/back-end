// Added By Youssef 
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const PostImage = require('./PostImage');
const Brand = require('./Brand');

const PostPosition = sequelize.define('PostPosition', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    post_image_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PostImage,
            key: 'id',
        },
    },

    x: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    y: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    category: { 
        type: DataTypes.STRING,
        allowNull: false,
    },

    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = PostPosition;

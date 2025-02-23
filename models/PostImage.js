// Added By Youssef
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 
const Post = require('./Post');
const { tableName } = require('./LikePost');
const PostImage = sequelize.define('PostImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'id',
        },
    },

    url: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "PostImages"
});

module.exports = PostImage;

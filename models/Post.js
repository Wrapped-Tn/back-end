// Added By Youssef
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const User = require('./User');
const { tableName } = require('./LikePost');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    occasion: {
        type: DataTypes.JSON,
        allowNull: true,
    },

    likes_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },

    saves_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    comments_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    trend: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "Posts"
});

module.exports = Post;

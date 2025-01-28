const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = require('./User');
const Brand = require('./Brand');
const Post = require('./Post');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },

    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
    },

    clotheType: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    brandId: {
        type: DataTypes.INTEGER,
        references: {
            model: Brand,
            key: 'id',
        },
    },

    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Cart;
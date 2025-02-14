const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = require('./User');
const Brand = require('./Brand');
const Order= require('./Order')
const Post = require('./Post');

const Article = require('./Article');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    posterId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },

    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },

    brandId:{
        type: DataTypes.INTEGER,
        references:{
            model:Brand,
            key:'id'
        }
    },

    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
    },

    article_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Article,
            key: 'id',
        },
    },

    orderId: {
        type: DataTypes.INTEGER, 
        references: { 
            model: 'orders', 
            key: 'id', 
        },
        allowNull: true, 
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        },

    orderBrandId: {
        type: DataTypes.INTEGER, 
        references: { 
            model: 'ordersbrands', 
            key: 'id', 
        },
        allowNull: true, 
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
    color:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    size:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    category:{
        type: DataTypes.STRING,
        allowNull: false,
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
},
    {timestamps: true,
    tableName: "carts" }
);

module.exports = Cart;
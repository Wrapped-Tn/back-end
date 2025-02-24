const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");
const Brand = require ("./Brand")
const User =require("./User")
const Post =require('./Post')

const FashionistaTag = sequelize.define('FashionistaTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model:Brand ,
            key: 'id',
          }, 
         },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model:User ,
            key: 'id',
          },
        },
    articleId: {
        type: DataTypes.INTEGER,
        references: {
            model:Post ,
            key: 'id',
          },  
         },
    status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected'),
        defaultValue: 'pending',
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true, // Raison du rejet, si applicable
    }
});

module.exports = FashionistaTag;

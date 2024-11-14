const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Brand = require ("./Brand.js")
const User =require("./User.js")

const Rating = sequelize.define('Rating', {
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
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

module.exports = Rating;

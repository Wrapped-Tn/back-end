const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");
const Brand = require ("./Brand")
const User =require("./User")

const Rating = sequelize.define('Rating', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    brandId: {
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
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    }
});

module.exports = Rating;

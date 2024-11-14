const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Brand = require ("./Brand.js")
const User =require("./User.js")

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model:User ,
            key: 'id',
          },   
        },
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model:Brand ,
            key: 'id',
          },    
        },
    articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'preparation', 'shipped', 'delivered', 'returned'),
        defaultValue: 'pending',
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});

module.exports = Order;

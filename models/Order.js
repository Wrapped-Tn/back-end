const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");
const User = require("./User");
const Cart = require("./Cart");
const Address = require('./Address');

const Order = sequelize.define('Order', {
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

    adressId: {
        type: DataTypes.INTEGER,
        references: {
            model: Address,
            key: 'id',
        },
    },
    
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM('init', 'pending', 'preparation', 'shipped', 'delivered', 'returned'),
        defaultValue: 'init',
    },

    deliveryCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 8
    }

}, {
    timestamps: true,
    tableName: "orders"}
);

module.exports = Order;
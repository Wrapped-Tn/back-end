const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");
const User = require("./User");
const Cart = require("./Cart");

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

    cartIds: {
        type: DataTypes.JSON(DataTypes.INTEGER),
        allowNull: false,
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
    timestamps: true
}
);

module.exports = Order;
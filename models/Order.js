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

    cartId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cart,
            key: 'id',
        },
    },

    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    status: {
        type: DataTypes.ENUM('pending', 'preparation', 'shipped', 'delivered', 'returned'),
        defaultValue: 'pending',
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
);

module.exports = Order;
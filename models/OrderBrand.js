const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");
const User = require("./User");
const Cart = require("./Cart");
const Brand = require('./Brand');

const OrderBrand = sequelize.define('OrderBrand', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    brandId: {
        type: DataTypes.INTEGER,
        references: {
            model: Brand,
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
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }

}, {
    timestamps: true,
    tableName: "ordersbrands"}
);

module.exports = OrderBrand;
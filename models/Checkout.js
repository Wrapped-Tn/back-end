const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const Checkout = sequelize.define('checkout', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderBrandId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payType: {
        type: DataTypes.ENUM('delivery','sold','cart'),
        allowNull:false
    }
   
}, {
    tableName: 'checkouts',
    timestamps: true
});

module.exports = Checkout;

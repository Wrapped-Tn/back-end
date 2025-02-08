const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); 

const Address = sequelize.define('address', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false
    },

    state: {
        type: DataTypes.STRING,
        allowNull: false
    },

    city: {
        type: DataTypes.STRING,
        allowNull: false
    },

    postalCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
}, {
    tableName: 'addresses',
    timestamps: true
});

module.exports = Address;

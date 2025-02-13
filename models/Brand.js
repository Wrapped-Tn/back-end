const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Auth= require('./Auth.js')

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountLevel: {
    type: DataTypes.ENUM('free', 'level_1', 'level_2', 'level_3', 'level_4', 'vip'),
    defaultValue: 'free',
  },
  total_sales: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.STRING,
  },

  store_location: {
    type: DataTypes.STRING,
  },

  bank_account_info: {
    type: DataTypes.STRING,
  },

  // The following will represent the avg.
  rating: {
    type: DataTypes.FLOAT
  }
  
}, {
  tableName: 'brands',
  timestamps: true
});

module.exports = Brand;

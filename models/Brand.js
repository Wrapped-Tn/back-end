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
  
}, {
  tableName: 'brands',
  timestamps: true
});

module.exports = Brand;

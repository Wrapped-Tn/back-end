const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acount_level:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{8}$/,
    },
  },
    logo_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
  },
  accountLevel: {
    type: DataTypes.ENUM('free', 'level_1', 'level_2', 'level_3', 'level_4', 'vip'),
    defaultValue: 'free',
},
  total_sales:{
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
});
module.exports = Brand;

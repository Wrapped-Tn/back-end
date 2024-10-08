const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
  },
  social_login: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  social_platform: {
    type: DataTypes.STRING,
  },
  grade: {
    type: DataTypes.STRING,
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
  },
  user_type: {
    type: DataTypes.ENUM('regular', 'seller'),
    defaultValue: 'regular',
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  profile_picture_url: {
    type: DataTypes.STRING,
  },
  commission_earned: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  }
});

module.exports = User;

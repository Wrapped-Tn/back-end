const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");

const Auth = sequelize.define('Auth', {
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
  social_login: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  social_platform: {
    type: DataTypes.STRING,
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
  profile_picture_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
  },
   role: {
    type: DataTypes.ENUM('brand', 'user'),
  }
});
module.exports = Auth;

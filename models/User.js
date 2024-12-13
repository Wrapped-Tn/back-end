const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Grade = require('./Grade');

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
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
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
  grade_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Grade,
      key: 'id',
    },
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  user_type: {
    type: DataTypes.ENUM('regular', 'seller'),
    defaultValue: 'regular',
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
  commission_earned: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  sexe: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
  },
  birthdate: {
    type: DataTypes.DATE,
  },
});
module.exports = User;

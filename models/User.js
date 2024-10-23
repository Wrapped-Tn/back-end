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
    validate: {
      isEmail: true, // Ensures that the value is a valid email
    }
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
    allowNull: true, // Only required if `social_login` is true
  },
  grade: {
    type: DataTypes.STRING, // Adjust to ENUM or INTEGER if needed
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  user_type: {
    type: DataTypes.ENUM('regular', 'seller'),
    defaultValue: 'regular',
  },
  phone_number: {
    type: DataTypes.STRING,
    validate: {
      is: /^[0-9]{8}$/ // Regular expression for a Tunisian phone number (8 digits)
    },
  },
  profile_picture_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true, // Ensures the value is a valid URL
    }
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

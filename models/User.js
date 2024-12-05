const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Grade = require('./Grade');
const Auth= require('./Auth.js')
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  auth_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Auth, // Table name
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Grade,
      key: 'id',
    },
  },
  user_type: {
    type: DataTypes.ENUM('regular', 'seller'),
    defaultValue: 'regular',
  },
  commission_earned: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  sexe: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  birthdate: {
    type: DataTypes.DATE,
  },
});

module.exports = User;

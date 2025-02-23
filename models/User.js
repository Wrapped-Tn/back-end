const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Grade = require('./Grade');
const { tableName } = require('./LikePost.js');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  social_login: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  grade_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Grade,
      key: 'id',
    },
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
  }
  
}, {
  tableName: "Users"
});

module.exports = User;

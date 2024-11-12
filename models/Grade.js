const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  grade_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  min_stars: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_stars: {
    type: DataTypes.INTEGER,
    allowNull: true, // null for the last grade where there's no upper limit
  },
  min_sales: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_sales: {
    type: DataTypes.INTEGER,
    allowNull: true, // null for the last grade where there's no upper limit
  },
  rewards: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false, // If you don't want Sequelize to manage timestamps automatically
});

module.exports = Grade;

const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");

const Filter = sequelize.define('Filter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  category_filter: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  filter_type: {
    type: DataTypes.ENUM('paid', 'free'),
    defaultValue: 'free',
  },
  prix_filter: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = Filter;

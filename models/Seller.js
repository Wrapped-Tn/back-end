const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const User = require('./User.js');

const Seller = sequelize.define('Seller', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  store_location: {
    type: DataTypes.STRING,
  },
  bank_account_info: {
    type: DataTypes.STRING,
  },
  seller_rating: {
    type: DataTypes.DECIMAL(3, 2),
  },
});

module.exports = Seller;

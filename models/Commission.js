const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const User = require('./User.js');
const Transaction = require('./Transaction.js');

const Commission = sequelize.define('Commission', {
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
  transaction_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Transaction,
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  earned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

module.exports = Commission;

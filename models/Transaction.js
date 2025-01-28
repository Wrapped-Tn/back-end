const { DataTypes } = require('sequelize');
const sequelize = require("../config/config");
const User = require('./User');
const Brand =require('./Brand');

const Transaction = sequelize.define('Transaction', {
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

  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Brand,
      key: 'id',
    },
  },
  
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },

  commission: {
    type: DataTypes.DECIMAL(10, 2),
  },
  
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

module.exports = Transaction;

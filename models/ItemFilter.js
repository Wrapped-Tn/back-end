const { DataTypes } = require('sequelize');
const sequelize = require("../config/config.js");
const Article = require('./Article.js');
const Filter = require('./Filter.js');

const ItemFilter = sequelize.define('ItemFilter', {
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Article,
      key: 'id',
    },
  },
  filter_value_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Filter,
      key: 'id',
    },
  }
}, {
  timestamps: false,
  primaryKey: false,
});

module.exports = ItemFilter;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Article = require('./Article');  // Ensure that Article is correctly imported here

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'articles',  // Refers to the 'articles' table
      key: 'id',
    },
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'images',
  timestamps: false,
});


module.exports = Image;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust the path as needed
const Image = require('./Image'); // Import Image to establish the association

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brands', // Use lowercase to match the MySQL table name
      key: 'id'
    }, 
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  available_stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, 
{
  tableName: 'articles',
  timestamps: true,
});

// Associate Article with Images (One-to-Many)
Article.hasMany(Image, {
  foreignKey: 'article_id',
  as: 'images', // Alias used for the include in the controller
});
Image.belongsTo(Article, {
  foreignKey: 'article_id',
  as: 'article',
});

module.exports = Article;

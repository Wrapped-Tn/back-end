// models/Like.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User'); 
const Article = require('./Article');
const Comment = require('./Comments');

class Like extends Model {}

Like.init(
  {
    idlikes: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    likeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id', 
      },
    },
    articles_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Article,
        key: 'id', 
      },
    },
    comments_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
        key: 'id', 
      },
    },
  },
  {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: false,
  }
);

// Define associations
Like.belongsTo(User, { foreignKey: 'users_id' });
Like.belongsTo(Article, { foreignKey: 'articles_id' });
Like.belongsTo(Comment, { foreignKey: 'comments_id' });

module.exports = Like;

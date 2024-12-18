const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config.js');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, 
    },
    content: {
      type: DataTypes.STRING(200),
      allowNull: false, 
      validate: {
        notEmpty: true,
      },
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',
      },
    },
    articles_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'articles', 
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
  },
  {
    sequelize,
    modelName: 'comment',
    tableName: 'comments', 
    timestamps: true, 
  }
);


module.exports = Comment;

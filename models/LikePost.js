// Added By Youssef
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = require('./User');
const Post = require('./Post');

class LikePost extends Model {}

LikePost.init(
  {
    id: {
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
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'LikePost',
    tableName: 'likePost',
    timestamps: false,
  }
);
// models/LikePost.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'LikePost',
    tableName: 'likePost',
    timestamps: false,
  }
);

module.exports = LikePost;
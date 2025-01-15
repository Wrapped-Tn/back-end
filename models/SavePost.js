// Added By Youssef
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');

const User = require('./User');
const Post = require('./Post');

class SavePost extends Model {}

SavePost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    saveDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
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
    modelName: 'SavePost',
    tableName: 'savePost',
    timestamps: false,
  }
);

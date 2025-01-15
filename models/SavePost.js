// models/SavePost.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');

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
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SavePost',
    tableName: 'savePost',
    timestamps: false,
  }
);

module.exports = SavePost;
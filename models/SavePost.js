const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const SavePost = sequelize.define('SavePost', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  saveDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'savePost',  // Explicitly set the table name
  timestamps: false,       // Ensure createdAt & updatedAt are handled
});

module.exports = SavePost;

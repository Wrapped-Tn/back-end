const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config.js');

class Savings extends Model {}

Savings.init({}, { sequelize, modelName: 'savings', timestamps: false });

module.exports = Savings;

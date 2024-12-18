const Sequelize = require("sequelize");

const sequelize = new Sequelize("wrapped", "root", "tassou", {
    dialect: "mysql",
    host: "localhost",
  });
  
  module.exports = sequelize;
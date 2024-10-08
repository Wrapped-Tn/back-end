const Sequelize = require("sequelize");

const sequelize = new Sequelize("wrapped", "root", "407000", {
    dialect: "mysql",
    host: "localhost",
  });
  
  module.exports = sequelize;
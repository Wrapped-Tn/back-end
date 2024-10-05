const Sequelize = require("sequelize");

const sequelize = new Sequelize("Wrapped", "root", "407000", {
    dialect: "mysql",
    host: "localhost",
  });
  
  module.exports = sequelize;
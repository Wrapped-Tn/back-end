const Sequelize = require("sequelize");

const sequelize = new Sequelize("wrapped", "root", "", {
    dialect: "mysql",
    host: "localhost",
  });
  
  module.exports = sequelize;
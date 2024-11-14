const User = require("./User");
const Seller = require("./Seller");
const Article = require("./Article");
const Filter = require('./Filter');
const Commission =require ("./Commission");
const Transaction = require ("./Transaction");
const Grade = require('./Grade');

const sequelize = require("../config/config.js");

// User et Seller
User.hasOne(Seller, { foreignKey: 'user_id' });
Seller.belongsTo(User, { foreignKey: 'user_id' });

// Seller et Article
Seller.hasMany(Article, { foreignKey: 'seller_id' });
Article.belongsTo(Seller, { foreignKey: 'seller_id' });

// Article et ItemFilter (Relation N-N avec Filter)
Article.belongsToMany(Filter, { through: 'ItemFilter', foreignKey: 'item_id' });
Filter.belongsToMany(Article, { through: 'ItemFilter', foreignKey: 'filter_value_id' });

// User et Transaction
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// Article et Transaction
Article.hasMany(Transaction, { foreignKey: 'item_id' });
Transaction.belongsTo(Article, { foreignKey: 'item_id' });

// User et Commission
User.hasMany(Commission, { foreignKey: 'user_id' });
Commission.belongsTo(User, { foreignKey: 'user_id' });

// Transaction et Commission
Transaction.hasMany(Commission, { foreignKey: 'transaction_id' });
Commission.belongsTo(Transaction, { foreignKey: 'transaction_id' });

Grade.hasMany(User, { foreignKey: 'transaction_id' });
User.belongsTo(Grade, { foreignKey: 'grade_id', as: 'grade' });

// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database tables synchronized successfully.");
//     // Start your application or perform any other actions here
//   })
//   .catch((error) => {
//     console.error("Error synchronizing database:", error);
//   });


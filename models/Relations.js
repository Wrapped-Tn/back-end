// Start Added By Youssef
const Post = require('./Post');
console.log('Post Model:', Post);


const PostImage = require('./PostImage');
const PostPosition = require('./PostPosition');

const LikePost = require('./LikePost');
const SavePost = require('./SavePost');

const Article = require('./Article');
// End Added By Youssef

// Causing issue
const Comment = require('./Comment');
console.log('Comment Model:', Comment);

const User = require("./User");
console.log('User Model:', User);


// const Article = require("./Article");
const Filter = require('./Filter');
const Commission =require ("./Commission");
const Transaction = require ("./Transaction");
const Grade = require('./Grade');
const Brand= require("./Brand");
const Order= require('./Orders');
const Rating=require('./Rating');
const FashionistaTag=require('./FashionistaTag');
const Invoice=require("./Invoice");
// const Like = require('./Like');
const Auth=require('./Auth');
const sequelize = require("../config/config.js");
const { on } = require('nodemailer/lib/xoauth2/index.js');

// Relation avec Brand
// Brand.hasOne(Auth, { foreignKey: 'users_id' });
// Auth.belongsTo(Brand, { foreignKey: 'users_id' });

// // Relation avec User
// User.hasOne(Auth, { foreignKey: 'users_id' });
// Auth.belongsTo(User, { foreignKey: 'users_id' });

// Start Added By Youssef
Post.hasMany(PostImage, { foreignKey: 'post_id', onDelete: 'CASCADE' });
PostImage.belongsTo(Post, { foreignKey: 'post_id' });

PostImage.hasMany(PostPosition, { foreignKey: 'post_image_id', onDelete: 'CASCADE' });
PostPosition.belongsTo(PostImage, { foreignKey: 'post_image_id' });

Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });

Post.hasMany(Article, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Article.belongsTo(Post, { foreignKey: 'post_id' });
// Likes and Posts
Post.hasMany(LikePost, { foreignKey: 'post_id', onDelete: 'CASCADE' });
LikePost.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(LikePost, { foreignKey: 'user_id', onDelete: 'CASCADE' });
LikePost.belongsTo(User, { foreignKey: 'user_id' });

// Saves and Posts
Post.hasMany(SavePost, { foreignKey: 'post_id', onDelete: 'CASCADE' });
SavePost.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(SavePost, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavePost.belongsTo(User, { foreignKey: 'user_id' });

// Comments and Posts
Post.hasMany(Comment, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id' });


// End Added By Youssef

// User et Seller
// User.hasOne(Brand, { foreignKey: 'user_id' });
// Brand.belongsTo(User, { foreignKey: 'user_id' });

// // Seller et Article
// Brand.hasMany(Post, { foreignKey: 'seller_id' });
// Article.belongsTo(Brand, { foreignKey: 'seller_id' });

// Article et ItemFilter (Relation N-N avec Filter)
// Article.belongsToMany(Filter, { through: 'ItemFilter', foreignKey: 'item_id' });
// Filter.belongsToMany(Article, { through: 'ItemFilter', foreignKey: 'filter_value_id' });

// User et Transaction
User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// Article et Transaction
Brand.hasMany(Transaction, { foreignKey: 'item_id' });
Transaction.belongsTo(Brand, { foreignKey: 'item_id' });

// User et Commission
User.hasMany(Commission, { foreignKey: 'user_id' });
Commission.belongsTo(User, { foreignKey: 'user_id' });

// Transaction et Commission
Transaction.hasMany(Commission, { foreignKey: 'transaction_id' });
Commission.belongsTo(Transaction, { foreignKey: 'transaction_id' });

Grade.hasMany(User, { foreignKey: 'transaction_id' });
User.belongsTo(Grade, { foreignKey: 'grade_id', as: 'grade' });

// Un vendeur peut avoir plusieurs commandes.// Une commande appartient à un vendeur.
Brand.hasMany(Order, { foreignKey: 'sellerId' });
Order.belongsTo(Brand, { foreignKey: 'sellerId', as: 'Brand' });

// Un utilisateur peut passer plusieurs commandes.// Une commande appartient à un utilisateur.
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Un vendeur peut recevoir plusieurs évaluations.// Une évaluation appartient à un vendeur.
Brand.hasMany(Rating, { foreignKey: 'sellerId' });
Rating.belongsTo(Brand, { foreignKey: 'sellerId', as: 'Brand' });

// Un utilisateur peut laisser plusieurs évaluations.// Une évaluation appartient à un utilisateur.
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Un vendeur peut avoir plusieurs tags sur ses articles.// Un tag appartient à un vendeur.
Brand.hasMany(FashionistaTag, { foreignKey: 'sellerId' });
FashionistaTag.belongsTo(Brand, { foreignKey: 'sellerId', as: 'Brand' });

// Un utilisateur peut taguer plusieurs articles.// Un tag appartient à un utilisateur.
User.hasMany(FashionistaTag, { foreignKey: 'userId' });
FashionistaTag.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Une commande contient un article.// Un article peut être lié à plusieurs commandes.
// Article.hasMany(Order, { foreignKey: 'articleId' });
// Order.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

// Un vendeur peut avoir plusieurs factures.// Une facture appartient à un vendeur.
Brand.hasMany(Invoice, { foreignKey: 'sellerId' });
Invoice.belongsTo(Brand, { foreignKey: 'sellerId', as: 'Brand' });

// Relation avec likes et comments

// Like.belongsTo(User, { foreignKey: 'users_id' });
// Like.belongsTo(Article, { foreignKey: 'articles_id' });

// Like.belongsTo(Comment, { foreignKey: 'comment_id' });
// User.hasMany(Like, { foreignKey: 'users_id' });

// Article.hasMany(Like, { foreignKey: 'articles_id' });
// Comment.hasMany(Like, { foreignKey: 'comment_id' });

// User.hasMany(Article, { foreignKey: 'users_id' }); 
// Article.belongsTo(User, { foreignKey: 'users_id' }); 

// Create tables in correct order
// sequelize
//   .sync({ 
//     alter: true,
//     order: [
//       ['Grades'],
//       ['Users'],
//       ['brands'],  
//       ['comments'],
//       ['ratings'],
//       ['orders'],
//       ['invoices'],
//       ['transactions'],
//       ['commissions'],
//       ['filters'],
//       ['fashionista_tags'],
//       ['images'],
//       ['Post'],
//       ['PostImage'],
//       ['PostPosition'],
//       ['savePost'],
//       ['likePost'],
//     ]
//   })
//   .then(() => {
//     console.log("Database tables updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Error updating database tables:", error);
//   });


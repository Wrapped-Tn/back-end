const { Savings } = require('../models/Savings');
const { Article } = require('../models/Article');

const getSavedArticlesByUser = async (userId) => {
  return await Savings.findAll({
    where: { user_id: userId },
    include: [{ model: Article }],
  });
};

const addSaving = async (userId, articleId) => {
  return await Savings.create({ user_id: userId, article_id: articleId });
};

const deleteSaving = async (userId, articleId) => {
  return await Savings.destroy({
    where: { user_id: userId, article_id: articleId },
  });
};

module.exports = { getSavedArticlesByUser, addSaving, deleteSaving };

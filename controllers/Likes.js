const { Like } = require('../models/Like');
const { Article } = require('../models/Article');

async function getArticlesLikedByUser(userId) {
  try {
    console.log(`Fetching liked articles for userId: ${userId}`);

    // Ensure Like model is defined
    if (!Like) {
      console.error('Like model is undefined');
      throw new Error('Like model is not defined');
    }

    const likedArticles = await Like.findAll({
      where: { users_id: userId },
      include: [{
        model: Article,
        required: false, // Whether or not to fetch associated articles
      }],
    });

    if (!likedArticles || likedArticles.length === 0) {
      console.log(`No liked articles found for userId: ${userId}`);
      return [];  // Return an empty array if no liked articles are found
    }

    console.log(`Found ${likedArticles.length} liked articles for userId: ${userId}`);
    return likedArticles;
  } catch (error) {
    console.log('====================================');
    console.log('hello',Article);
    console.log('====================================');
    console.error('Error fetching liked articles:', error);
    throw new Error('An error occurred while fetching liked articles');
  }
}
const addLike = async (userId, articleId) => {
  try {
    const newLike = await Like.create({ user_id: userId, article_id: articleId });

    // Fetch the article details of the liked article
    const articleDetails = await Article.findOne({
      where: { id: articleId },
    });

    return {
      likeDetails: newLike,
      articleDetails,
    };
  } catch (error) {
    console.error("Error adding like:", error);
    throw error;
  }
};

const deleteLike = async (userId, articleId) => {
  try {
    // Fetch the article details before deleting the like
    const articleDetails = await Article.findOne({
      where: { id: articleId },
    });

    const deletedLikeCount = await Like.destroy({
      where: { user_id: userId, article_id: articleId },
    });

    if (deletedLikeCount > 0) {
      return {
        message: "Like deleted successfully.",
        articleDetails,
      };
    } else {
      return { message: "No like found to delete." };
    }
  } catch (error) {
    console.error("Error deleting like:", error);
    throw error;
  }
};

module.exports = { getArticlesLikedByUser, addLike, deleteLike };



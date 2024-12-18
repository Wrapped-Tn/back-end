const Comment= require('../models/Comments');
const User  = require('../models/User');


const getCommentsByArticle = async (id) => {
  try {
    const comments = await Comment.findAll({
      where: { articles_id: id }, 
      attributes: ['id', 'content', 'createdAt', 'updatedAt'], 
      include: [{ model: User, as: 'User', attributes: ['full_name', 'profile_picture_url'] }]
,
      order: [['createdAt', 'DESC']], 
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Example addComment function (use your own DB logic)
const addComment = async (users_id, articles_id, content) => {
  try {
    // Create the comment
    const comment = await Comment.create({
      content: content,
      users_id: users_id,
      articles_id: articles_id,
    });

    // Retrieve the user info from the users table along with the comment
    const commentWithUser = await Comment.findOne({
      where: { id: comment.id }, // Ensure to fetch the newly created comment by its ID
      include: {
        model: User,
        as: 'User',
        attributes: ['full_name', 'profile_picture_url'],
      },
    });

    return commentWithUser;
  } catch (error) {
    throw new Error('Error adding comment with user info: ' + error.message);
  }
};


const deleteComment = async (commentId) => {
  return await Comment.destroy({ where: { id: commentId } });
};


const updateComment = async (commentId, newContent) => {
  return await Comment.update(
    { content: newContent },
    { where: { id: commentId } }
  );
};
module.exports = { getCommentsByArticle, addComment, deleteComment, updateComment };

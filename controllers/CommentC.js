const Comment = require('../models/Comment');
const User = require('../models/User');
const Auth = require('../models/Auth');
const Post = require('../models/Post');
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Récupérer les commentaires avec les infos utilisateur (sans profile_picture_url)
    const comments = await Comment.findAll({
      where: { post_id: postId },
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'full_name'], 
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Extraire les IDs uniques des utilisateurs
    const userIds = [...new Set(comments.map(comment => comment.User?.id).filter(Boolean))];

    // Récupérer les images de profil depuis la table Auth
    const authRecords = await Auth.findAll({
      where: { users_id: userIds },
      attributes: ['users_id', 'profile_picture_url'],
    });

    // Convertir en objet { userId: profile_picture_url } pour un accès rapide
    const authMap = authRecords.reduce((acc, auth) => {
      acc[auth.users_id] = auth.profile_picture_url;
      return acc;
    }, {});

    // Ajouter l'image de profil à chaque commentaire
    const enrichedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      time:comment.createdAt,
      User: {
        id: comment.User?.id || null,
        full_name: comment.User?.full_name || null,
        profile_picture_url: authMap[comment.User?.id] || null, // Ajouter l'image de profil
      },
    }));

    res.status(200).json(enrichedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};



const addComment = async (req, res) => {
  try {
    const {  content } = req.body;
    const { postId,userId } = req.params;

    if (!userId || !content) {
      return res.status(400).json({ message: 'User ID and content are required.' });
    }

    // Create the comment
    const comment = await Comment.create({
      content,
      user_id: userId,
      post_id: postId,
    });
    const post = await Post.findOne({ where: { id: postId } });
    post.comments_count += 1;
    await post.save();
    // Fetch comment with user details
    // const commentWithUser = await Comment.findOne({
    //   where: { id: comment.id },
    //   include: [
    //     {
    //       model: User,
    //       as: 'User',
    //       attributes: ['full_name'],
    //       include: [
    //         {
    //           model: Auth,
    //           attributes: ['profile_picture_url'],
    //           where: { users_id: userId },
    //           required: false,
    //         },
    //       ],
    //     },
    //   ],
    // });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedCount = await Comment.destroy({ where: { id: commentId } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const [updatedCount] = await Comment.update(
      { content },
      { where: { id: commentId } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.status(200).json({ message: 'Comment updated successfully.' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment.' });
  }
};

module.exports = { getCommentsByPost, addComment, deleteComment, updateComment };

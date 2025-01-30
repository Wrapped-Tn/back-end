const LikePost = require('../models/LikePost');
const Post = require('../models/Post');
const User = require('../models/User');
const PostImage = require('../models/PostImage');

const getLikedPostsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const likedPosts = await LikePost.findAll({
            where: { users_id: user_id },
            include: { model: Post },
        });

        if (likedPosts.length === 0) {
            res.status(404).json({ error: 'No liked posts found' });
        }

        res.status(200).json(likedPosts);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve liked posts' });
    }

};

const getLikedPostImages = async (req, res) => {
  try {
    const  userId  = req.params.user_id; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

    // 1. Récupérer tous les posts likés par l'utilisateur
    const likedPosts = await LikePost.findAll({
      where: { user_id: userId }, // Filtrer par user_id
      attributes: ['post_id'], // Récupérer uniquement l'ID des posts likés
    });
    console.log("likedPosts",likedPosts+"userId",userId);

    if (likedPosts.length === 0) {
      return res.status(404).json({ message: 'Aucun post liké trouvé pour cet utilisateur.' });
    }

    // 2. Récupérer les informations des posts et leurs images associées
    const postIds = likedPosts.map((like) => like.post_id); // Récupérer les IDs des posts likés

    const posts = await Post.findAll({
      where: { id: postIds }, // Filtrer les posts par les IDs récupérés
      include: [
        {
          model: PostImage, // Inclure les images du post
          attributes: ['url'], // Récupérer l'URL de l'image
        },
      ],
    });

    // 3. Vérifier si des posts ont été trouvés
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Aucun post trouvé pour les IDs fournis.' });
    }

    // 4. Extraire les images et les ID des posts
    const images = posts.map((post) => ({
      postId: post.id, // ID du post
      imageUrl: post.PostImages[0]?.url || null, // URL de l'image, ou null si pas d'image
    }));

    // 5. Retourner les images des posts likés
    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les images des posts likés.' });
  }
};

const toggleLike = async (req, res) => {
  const user_id = req.params.user_id;
  const post_id = req.params.post_id;

  try {
      // Vérifier si l'utilisateur a déjà liké le post
      const existingLike = await LikePost.findOne({ where: { user_id, post_id } });

      if (existingLike) {
          // Si l'utilisateur a déjà liké, supprimer le like (dislike)
          await LikePost.destroy({ where: { user_id, post_id } });

          // Décrémenter le like_count du post
          await Post.decrement('likes_count', { where: { id: post_id } });

          return res.status(200).json({ message: 'Like retiré (dislike).' });
      } else {
          // Si l'utilisateur n'a pas encore liké, ajouter un like
          await LikePost.create({ user_id, post_id, likeDate: new Date() });

          // Incrémenter le like_count du post
          await Post.increment('likes_count', { where: { id: post_id } });

          return res.status(201).json({ message: 'Like ajouté avec succès.' });
      }
  } catch (error) {
      console.error('Erreur lors de l\'ajout/suppression du like:', error);
      res.status(500).json({ message: 'Échec de l\'opération.' });
  }
};

const getLikeCount = async (req, res) => {
  const post_id = req.params.post_id 
  const user_id = req.params.user_id // L'ID de l'utilisateur qui fait la requête

  try {
      // Récupérer le nombre de likes depuis la table Post
      const post = await Post.findOne({
          where: { id: post_id },
          attributes: ['likes_count'],
      });

      if (!post) {
          return res.status(404).json({ message: 'Post non trouvé.' });
      }

      // Vérifier si l'utilisateur a déjà liké ce post
      const existingLike = await LikePost.findOne({
          where: { post_id, user_id }
      });

      res.status(200).json({
          likes_count: post.likes_count,
          liked: !!existingLike // true si l'utilisateur a liké, false sinon
      });
  } catch (error) {
      console.error('Erreur lors de la récupération du nombre de likes:', error);
      res.status(500).json({ message: 'Échec de la récupération du nombre de likes.' });
  }
};

module.exports = { 
  getLikedPostImages,
  toggleLike,
  getLikeCount,
};
// Updated by Youssef
const SavePost = require('../models/SavePost');
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');

const getSavedPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Récupérer tous les posts sauvegardés par l'utilisateur
    const savedPosts = await SavePost.findAll({
      where: { user_id: userId },
      attributes: ['post_id'], // Récupérer uniquement les IDs des posts sauvegardés
    });

    if (savedPosts.length === 0) {
      return res.status(404).json({ message: 'Aucun post sauvegardé trouvé pour cet utilisateur.' });
    }

    // 2. Récupérer les informations des posts et leurs images associées
    const postIds = savedPosts.map((save) => save.post_id);

    const posts = await Post.findAll({
      where: { id: postIds },
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
      postId: post.id,
      imageUrl: post.PostImages[0]?.url || null,
    }));

    // 5. Retourner les images des posts sauvegardés
    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les images des posts sauvegardés.' });
  }
};


const toggleSave = async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ error: 'Missing userId or postId' });
  }

  try {
    // Check if the post is already saved
    const existingSave = await SavePost.findOne({ where: { user_id: userId, post_id: postId } });

    if (existingSave) {
      // If saved, remove the save (unsave)
      await SavePost.destroy({ where: { user_id: userId, post_id: postId } });
      return res.status(200).json({ message: 'Post unsaved successfully.' });
    } else {
      // If not saved, add to saved posts
      await SavePost.create({ user_id: userId, post_id: postId, saveDate: new Date() });
      return res.status(201).json({ message: 'Post saved successfully.' });
    }
  } catch (error) {
    console.error('Error in saving/unsaving post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// ✅ Nouvelle fonction pour vérifier si un post est sauvegardé
const checkIfPostIsSaved = async (req, res) => {
  try {
    const { userId, postId } = req.params;

    if (!userId || !postId) {
      return res.status(400).json({ error: 'Missing userId or postId' });
    }

    const savedPost = await SavePost.findOne({ where: { user_id: userId, post_id: postId } });

    return res.status(200).json({ isSaved: !!savedPost }); // Retourne true si sauvegardé, sinon false
  } catch (error) {
    console.error('Error checking saved post:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getSavedPostsByUser, toggleSave,checkIfPostIsSaved };
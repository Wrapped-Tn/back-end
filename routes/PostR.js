// Added By Youssef
const express = require('express');
const router = express.Router();
// const multer = require('multer');

const {addPost,getUserPosts,getPostById,getMyWordrobes,deleteImages,WhatsHotPosts,verifyPostPosition,updatePostPositionPrice,getUserPostImages,getDiscrovePosts,getTopPostByUser} = require('../controllers/PostC');

// const storage = multer.memoryStorage();  // Stocke les fichiers temporairement en mémoire
// const upload = multer({ storage: storage }).array('images'); 
// Add a post
router.post('/posts', addPost);
// Get all posts of a user
router.get('/posts/user/:userId', getUserPosts);
// Get a post of a user
router.get('/posts/user/:userId/:postId', getPostById);
// Get all wordrobes of a user
router.get('/posts/wordrobes/:userId', getMyWordrobes);
// Get posts by user
router.get('/profileVisitor/:userId', getUserPostImages);
// Get top post by user
router.get('/stats/top5posts/:userId', getTopPostByUser);

// Get WhatsHot posts
router.get('/posts/whatshot', WhatsHotPosts);
// Get Discovery posts
router.get('/posts/discovry', getDiscrovePosts);
// Verify post position
router.put('/verify/:postPositionId', verifyPostPosition);
// Update post position price
router.put('/updateprice/:postId', updatePostPositionPrice);
// Delete images
router.delete('/posts/images/:userId', deleteImages);

module.exports = router;

// Added By Youssef
const express = require('express');
const router = express.Router();

const {addPost,getUserPosts,getPostById} = require('../controllers/PostC');

// Add a post
router.post('/posts', addPost);
// Get all posts of a user
router.get('/posts/user/:userId', getUserPosts);
// Get a post of a user
router.get('/posts/user/:userId/:postId', getPostById);

module.exports = router;

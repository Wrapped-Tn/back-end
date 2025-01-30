// Added By Youssef
const express = require('express');

const LikePostC = require('../controllers/LikePostC');

const router = express.Router();

// Get liked posts by user
router.get('/liked-posts/:user_id', LikePostC.getLikedPostImages);

router.post('/like-post/:post_id/:user_id', LikePostC.toggleLike);

router.get('/likes/:post_id/:user_id', LikePostC.getLikeCount);

module.exports = router;
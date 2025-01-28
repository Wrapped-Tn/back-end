// Added By Youssef
const express = require('express');

const {
  LikePostC,
} = require('../controllers/LikePostC');

const router = express.Router();

// Get liked posts by user
router.get('/liked-posts/:user_id', LikePostC.getLikedPostsByUser);

router.post('/like-post/:post_id/:user_id', LikePostC.addLike);

router.delete('/unlike-post/:post_id/:user_id', LikePostC.deleteLike);

module.exports = router;
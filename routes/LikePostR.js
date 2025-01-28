// Added By Youssef
const express = require('express');

const {
  LikePostC,
} = require('../controllers/LikePostC');

const router = express.Router();

// Get liked posts by user
router.get('/liked-posts/:user_id', LikePostC.getLikedPostsByUser);

module.exports = router;
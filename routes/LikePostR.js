// Added By Youssef
const express = require('express');

const {
  getLikedPostsByUser,
} = require('../controllers/LikePostC.js');

const router = express.Router();

// Get liked posts by user
router.get('/liked-posts/:user_id', getLikedPostsByUser);

module.exports = router;
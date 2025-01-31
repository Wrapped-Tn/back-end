const express = require('express');
const router = express.Router();
const { getSavedPostsByUser, toggleSave,checkIfPostIsSaved } = require('../controllers/SavePostC');

// Get saved posts by user
router.get('/saved-posts/:userId', getSavedPostsByUser);
// Check if a post is saved by a user
router.get('/saved/:userId/:postId', checkIfPostIsSaved);
// Single route to handle both saving and unsaving
router.post('/toggle-save', toggleSave);

module.exports = router;
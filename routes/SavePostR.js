const express = require('express');
const router = express.Router();
const { getSavedPostsByUser, toggleSave } = require('../controllers/SavePostC');

// Get saved posts by user
router.get('/saved-posts/:userId', getSavedPostsByUser);

// Single route to handle both saving and unsaving
router.post('/toggle-save', toggleSave);

module.exports = router;
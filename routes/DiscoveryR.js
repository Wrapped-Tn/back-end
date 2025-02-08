const express = require('express');
const { search } = require('../controllers/DiscoveryC'); 
const router = express.Router();

router.get('/search', search);

module.exports = router;

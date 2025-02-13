const express = require('express');
const { search,suggestions} = require('../controllers/DiscoveryC'); 
const router = express.Router();

router.get('/search', search);

router.get('/suggestions', suggestions);
module.exports = router;

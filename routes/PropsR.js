const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../Props/FileUpload');

// Upload route
router.post('/upload', upload, uploadImage);

module.exports = router;

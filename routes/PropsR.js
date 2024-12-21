const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../Props/FileUpload');

// Upload route
router.post('/upload', upload.single('file'), uploadImage);

module.exports = router;

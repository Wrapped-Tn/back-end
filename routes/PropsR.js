const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../Props/Cloudinary');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Route for image upload
router.post('/upload', upload.single('file'), uploadImage);

module.exports = router;

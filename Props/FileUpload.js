
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Auth = require('../models/Auth');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Access fields from req.body
        const fileUploadpicture = req.body.fileUploadpicture || 'default';
        const userId = req.body.userId || 'unknown';
        const typesignup = req.body.typesignup || 'unknown';
        // Create nested directory structure
        const uploadDir = path.join('uploads', fileUploadpicture, typesignup, userId);
        
        // Create directories if they don't exist
        fs.mkdirSync(uploadDir, { recursive: true });
        
        // Log for debugging
        console.log('Upload directory:', uploadDir);
        console.log('Request body:', req.body);
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Log for debugging
        console.log('Original filename:', file.originalname);
        
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create multer instance with configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
}).single('file');

// Upload function
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        // Create file URL with nested structure
        const fileUploadpicture = req.body.fileUploadpicture || 'default';
        const userId = req.body.userId || 'unknown';
        const typesignup = req.body.typesignup || 'unknown';
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileUploadpicture}/${typesignup}/${userId}/${req.file.filename}`;
        
        // Update Auth table with new profile picture URL
        try {
            const auth = await Auth.findOne({ 
                where: { 
                    users_id: userId,
                    role: req.body.typesignup 
                } 
            });
                if (auth) {
                auth.profile_picture_url = req.file.filename;
                await auth.save();
                console.log('Profile picture URL updated in Auth table');
            }
        } catch (dbError) {
            console.error('Error updating Auth table:', dbError);
            // Continue with the response even if DB update fails
        }

        return res.status(201).json({ 
            url: fileUrl,
            filename: req.file.filename,
            message: 'Profile picture updated successfully'
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ error: 'Failed to upload file.' });
    }
};
// Configuration du stockage pour les images des articles
const articleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const articleId = req.params.articleId;
        const uploadPath = path.join('posts', 'articles', articleId);

        // Créer le répertoire si nécessaire
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath); // Enregistre dans le dossier spécifique à l'article
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// Middleware pour le téléchargement d'images d'articles
const uploadArticle = multer({
    storage: articleStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
}).array('images', 3); // Limite à 3 images

// Fonction pour télécharger les images des articles
const uploadArticleImages = async (req, res) => {
    try {
        uploadArticle(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message });
            } else if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded.' });
            }

            const articleId = req.params.articleId;
            const fileUrls = req.files.map(file => ({
                url: `${req.protocol}://${req.get('host')}/posts/articles/${articleId}/${file.filename}`,
                filename: file.filename
            }));

            return res.status(201).json({ 
                message: 'Images uploaded successfully.',
                files: fileUrls
            });
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ error: 'Failed to upload images.' });
    }
};

// Export des fonctions
module.exports = { upload, uploadImage, uploadArticleImages };
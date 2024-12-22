
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Files will be stored in 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
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

// Create upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Upload function
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const X = req.params.id;
        // Create file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/  X /  username /${req.file.filename}`;
        
        return res.status(201).json({ 
            url: fileUrl,
            filename: req.file.filename
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
// const cloudinary = require('cloudinary').v2;
// require('dotenv').config(); // Charger les variables d'environnement

// // Configuration de Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Fonction d'upload
// const uploadImage = async (req, res) => {
//     const file = req.body.file; // Le fichier attendu en base64 ou chemin public

//     // Validation du fichier
//     if (!file) {
//         return res.status(400).json({ error: 'Aucun fichier fourni pour l\'upload.' });
//     }

//     try {
//         // Upload vers Cloudinary
//         const result = await cloudinary.uploader.upload(file, {
//             folder: 'wrapped', // Nom du dossier dans Cloudinary
//         });

//         console.log('Image uploaded avec succès:', result.secure_url);

//         // Retourner l'URL de l'image
//         return res.status(201).json({ url: result.secure_url });
//     } catch (error) {
//         console.error('Erreur lors de l\'upload:', error);

//         // Retourner une erreur
//         return res.status(500).json({ error: 'Échec de l\'upload de l\'image.' });
//     }
// };

// module.exports = uploadImage;

  
//   // Export the function
//   module.exports = { uploadImage };

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

module.exports = { upload, uploadImage };
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
const fs = require('fs');
const Auth = require('../models/Auth');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Access fields from req.body
        const fileUploadpicture = req.body.fileUploadpicture || 'default';
        const userId = req.body.userId || 'unknown';
        
        // Create nested directory structure
        const uploadDir = path.join('uploads', fileUploadpicture, userId);
        
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
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${fileUploadpicture}/${userId}/${req.file.filename}`;
        
        // Update Auth table with new profile picture URL
        try {
            const auth = await Auth.findOne({ where: { users_id: userId } });
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

module.exports = { upload, uploadImage };
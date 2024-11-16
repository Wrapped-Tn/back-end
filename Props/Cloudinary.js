const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Charger les variables d'environnement

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fonction d'upload
const uploadImage = async (req, res) => {
    const file = req.body.file; // Le fichier attendu en base64 ou chemin public

    // Validation du fichier
    if (!file) {
        return res.status(400).json({ error: 'Aucun fichier fourni pour l\'upload.' });
    }

    try {
        // Upload vers Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            folder: 'wrapped', // Nom du dossier dans Cloudinary
        });

        console.log('Image uploaded avec succès:', result.secure_url);

        // Retourner l'URL de l'image
        return res.status(201).json({ url: result.secure_url });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);

        // Retourner une erreur
        return res.status(500).json({ error: 'Échec de l\'upload de l\'image.' });
    }
};

module.exports = uploadImage;

  
  // Export the function
  module.exports = { uploadImage };

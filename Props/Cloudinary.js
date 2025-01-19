const { v2: cloudinary } = require('cloudinary');

// Configuration Cloudinary
cloudinary.config({
    cloud_name: 'djc7yq80i',
    api_key: '888862441633427',
    api_secret: '<your_api_secret>' // Remplacez par votre clé API secrète
});

const uploadImage = async (req, res) => {
    try {
        const { imageUrl } = req.body; // Supposons que l'URL de l'image soit envoyée dans le corps de la requête

        if (!imageUrl) {
            return res.status(400).json({ message: 'L\'URL de l\'image est requise' });
        }

        // Upload de l'image
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            public_id: 'uploaded_image',
        });

        // URL optimisée
        const optimizeUrl = cloudinary.url(uploadResult.public_id, {
            fetch_format: 'auto',
            quality: 'auto',
        });

        // URL avec transformation
        const autoCropUrl = cloudinary.url(uploadResult.public_id, {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });

        // Réponse au client
        res.status(200).json({
            message: 'Image uploadée avec succès',
            uploadResult,
            optimizeUrl,
            autoCropUrl,
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image', error });
    }
};

module.exports = { uploadImage };

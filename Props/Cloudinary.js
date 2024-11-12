const cloudinary = require('cloudinary').v2;


    // Configuration
    cloudinary.config({ 
        cloud_name: 'djc7yq80i', 
        api_key: '888862441633427', 
        api_secret: 'rPnQp-Y_ZLv6ZUeczJ-pcCCkipM' // Click 'View API Keys' above to copy your API secret
    });

    const uploadImage = async (req, res) => {
      const file = req.file.path;
      try {
          const result = await cloudinary.uploader.upload(file, {
              folder: 'wrapped'
          });
          console.log('Image uploaded:', result.secure_url);
          res.status(201).json({ url: result.secure_url });
      } catch (error) {
          console.error('Upload error:', error);
          res.status(500).json({ error: 'Image upload failed' });
      }
  };
  
  // Export the function
  module.exports = { uploadImage };

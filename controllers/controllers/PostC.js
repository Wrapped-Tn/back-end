// Added By Youssef
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const PostPosition = require('../models/PostPosition');

const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

require('dotenv').config();

const LikePost = require('../models/LikePost');

// Configurer Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Add a post with images and positions
const addPost = async (req, res) => {
    try {
      const { userId, description, occasion, images } = req.body;
  
      // Validate required fields
      if (!userId || !images || images.length === 0) {
        return res.status(400).json({ error: 'Required fields are missing.' });
      }
  
      // Parse occasion into an array
      const parsedOccasion = Array.isArray(occasion) ? occasion : (occasion ? occasion.split(',') : null);
  
      // Create the post
      const post = await Post.create({
        user_id: userId,
        description: description || null,
        occasion: parsedOccasion,
      });
  
      // Process each image
      for (const image of images) {
        if (!image.path || !Array.isArray(image.positions)) {
          return res.status(400).json({ error: 'Each image must have a file path and valid positions array.' });
        }
  
        try {
          // Read the local file
          const filePath = image.path; // Path to the local file
          const fileStream = fs.createReadStream(filePath); // Define fileStream here
  
          // Upload the image to Cloudinary
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'post_images' },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
  
            fileStream.pipe(uploadStream); // Use fileStream here
          });
  
          // Create the image associated with the post
          const postImage = await PostImage.create({
            post_id: post.id,
            url: uploadResult.secure_url, // Secure URL returned by Cloudinary
          });
  
          // Process each position associated with this image
          for (const position of image.positions) {
            if (
              !position.x || 
              !position.y || 
              !position.brand || 
              !position.category || // Ensure category is provided
              !position.size || 
              !position.prix
            ) {
              return res.status(400).json({ error: 'Invalid position data format.' });
            }
  
            // Create the position associated with the image
            await PostPosition.create({
              post_image_id: postImage.id,
              x: position.x,
              y: position.y,
              brand: position.brand,
              category: position.category, // Add category here
              size: position.size,
              prix: position.prix,
            });
          }
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          return res.status(400).json({ error: 'Failed to upload image.' });
        }
      }
  
      res.status(201).json({ message: 'Post created successfully!', post, articleId: post.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to complete post creation.' });
    }
};

// Get all posts of a user 
const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10

        // Convert page and limit to numbers
        const offset = (page - 1) * limit;

        const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
            limit: parseInt(limit), // Number of posts to return
            offset: parseInt(offset), // Starting point for fetching posts
            order: [['createdAt', 'DESC']], // Optional: Order by creation date (newest first)
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user.' });
        }

        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve posts.' });
    }
};

// Get all images of the posts of a user
const getMyWordrobes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10

        // Convert page and limit to numbers
        const offset = (page - 1) * limit;

        const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
            limit: parseInt(limit), // Number of posts to return
            offset: parseInt(offset), // Starting point for fetching posts
            order: [['createdAt', 'DESC']], // Optional: Order by creation date (newest first)
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user.' });
        }

        // Extract image URLs
        const imageUrls = posts.map(post => 
            post.PostImages.map(image => image.url)
        ).flat();

        res.status(200).json({ imageUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve posts.' });
    }
};

// Del image(Post)
const deleteImages = async (req, res) => {
    try {
        const { userId } = req.params; // Get the user ID
        const { imageUrls } = req.body; // List of image URLs to delete

        // Check if image URLs are provided
        if (!imageUrls || imageUrls.length === 0) {
            return res.status(400).json({ message: 'No images provided to delete.' });
        }

        // Delete images from Cloudinary
        const deletionPromises = imageUrls.map(url => {
            const publicId = url.split('/').pop().split('.')[0]; // Extract public ID from the URL
            return cloudinary.uploader.destroy(publicId); // Delete the image on Cloudinary
        });

        // Wait for all images to be deleted
        await Promise.all(deletionPromises);

        // Find the PostImage entries associated with the URLs
        const postImages = await PostImage.findAll({
            where: {
                url: imageUrls,
            },
            include: [Post], // Include the associated Post
        });

        // Extract the unique post IDs associated with the images
        const postIds = [...new Set(postImages.map(image => image.Post.id))];

        // Delete the PostImage entries from the database
        await PostImage.destroy({
            where: {
                url: imageUrls,
            },
        });

        // Delete the associated posts if they have no remaining images
        for (const postId of postIds) {
            const remainingImages = await PostImage.count({
                where: {
                    post_id: postId,
                },
            });

            if (remainingImages === 0) {
                await Post.destroy({
                    where: {
                        id: postId,
                        user_id: userId, // Ensure the post belongs to the user
                    },
                });
            }
        }

        res.status(200).json({ message: 'Images and associated posts deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete images and associated posts.' });
    }
};

// Get a post of a user
const getPostById = async (req, res) => {
    try {
        const { postId, userId } = req.params; 

        const post = await Post.findOne({
            where: { id: postId, user_id: userId }, 
            include: [
                {
                    model: PostImage,
                    include: [PostPosition],
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found for this user.' });
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve post.' });
    }
};

module.exports = {
    addPost,
    getUserPosts,
    getPostById,
    getMyWordrobes,
    deleteImages
};

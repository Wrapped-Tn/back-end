require('dotenv').config();

const Brand = require('../models/Brand');
const Auth = require('../models/Auth');
const User = require('../models/User');

const bcrypt = require('bcrypt');

const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const PostPosition = require('../models/PostPosition');

const { generateCode, verificationCodes, transporter } = require('../controllers/Auth/authentification');

const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Créer un vendeur
const createBrand = async (req, res) => {

  const { 
    email, 
    password, 
    brand_name, 
    description, 
    store_location, 
    bank_account_info, 
    profile_picture_url, 
    region, 
    phone_number 
  } = req.body;

  console.log(`Data sent by brand during signUp: ${JSON.stringify(req.body)}`);
  

  try {
    // Validate required fields
    if (!email || !password || !brand_name) {
      return res.status(400).json({ error: 'Email, password, and brand_name are required.' });
    }

    // Check if the email already exists
    const existingAuth = await Auth.findOne({ where: { email } });
    if (existingAuth) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload the profile picture to Cloudinary
    if (profile_picture_url) {
      const uploadedImage = await cloudinary.uploader.upload(profile_picture_url, {
        folder: 'brand-profiles',
      });
      profile_picture_url = uploadedImage.secure_url;
    }

    // Create the Auth entry for the brand
    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      profile_picture_url: profile_picture_url || '',
      description: description || '',
      store_location: store_location || '',
      bank_account_info: bank_account_info || '',
      region: region || '',
      phone_number: phone_number || '',
      role: 'brand',
      users_id: newBrand.id,
      isActive: false, // Mark the account as inactive until verified
    });

    // Generate a 4-digit verification code
    const code = generateCode();
    console.log('Generated verification code:', code);

    // Store the code with an expiration time (1 minute and 30 seconds)
    verificationCodes.set(email, { code, expiresAt: Date.now() + 90000 });

    // Send the verification code via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is ${code}. This code will expire in 1 minute and 30 seconds.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending verification email.' });
      }
      console.log('Verification email sent:', info.response);
      res.status(201).json({
        message: 'Verification code sent to email. Please verify your account.',
        brandId: newBrand.id,
        authId: newAuth.id,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create brand.' });
  }
};

// Récupérer un vendeur par ID
const getBrandById = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id, {
      include: {
        model: Auth,
        attributes: ['email', 'role'], // Inclure les détails d'authentification
      },
    });

    if (brand) {
      res.status(200).json(brand);
    } else {
      res.status(404).json({ error: 'Brand not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brand' });
  }
};

// Récupérer tous les vendeurs
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      include: {
        model: Auth,
        attributes: ['email', 'role'],
      },
    });

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

// Mettre à jour un vendeur
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brand_name, logo_url, accountLevel, email, password } = req.body;

  try {
    const brand = await Brand.findByPk(id, {
      include: { model: Auth },
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Mettre à jour les détails de la marque
    brand.brand_name = brand_name || brand.brand_name;
    brand.logo_url = logo_url || brand.logo_url;
    brand.accountLevel = accountLevel || brand.accountLevel;
    await brand.save();

    // Mettre à jour les détails d'authentification
    if (email || password) {
      const auth = await Auth.findByPk(brand.auth_id);

      if (email) auth.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        auth.password = await bcrypt.hash(password, salt);
      }

      await auth.save();
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update brand' });
  }
};

// Supprimer un vendeur
const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Supprimer la marque et son entrée Auth associée
    const auth = await Auth.findByPk(brand.auth_id);
    await auth.destroy();
    await brand.destroy();

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete brand' });
  }
};

const getBrandCart = async (req, res) => {
  const { idbrand,idauth } = req.body; // ID du vendeur transmis dans l'URL

  try {
    // Récupérer la marque avec l'authentification associée
    const brand = await Brand.findByPk(idbrand);
    const auth=await Auth.findByPk(idauth)
    if (brand) {
      res.status(200).json({
        brand_name: brand.brand_name,
        account_level: brand.accountLevel,
        total_sales: brand.total_sales,
        profile_picture_url: auth.profile_picture_url || '', // Photo de profil
      });
    } else {
      res.status(404).json({ message: 'Brand not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// Get taged posts
const getTaggedPosts = async (req, res) => {
  const { brand } = req.params;

  console.log(brand); 

  try {
    const taggedPositions = await PostPosition.findAll({
      where: { brand },
      include: [
        {
          model: PostImage,
          include: [
            {
              model: Post,
              include: [
                {
                  model: User,
                  attributes: ['id', 'full_name'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (taggedPositions.length === 0) {
      return res.status(404).json({ error: 'No posts found for this brand' });
    }

    const posts = taggedPositions.map((position) => ({
      postId: position.PostImage.Post.id,
      description: position.PostImage.Post.description,
      occasion: position.PostImage.Post.occasion,
      likesCount: position.PostImage.Post.likes_count,
      payTrend: position.PostImage.Post.pay_trend,
      verified: position.PostImage.Post.verified,
      createdAt: position.PostImage.Post.createdAt,
      updatedAt: position.PostImage.Post.updatedAt,
      user: {
        id: position.PostImage.Post.User.id,
        fullName: position.PostImage.Post.User.full_name,
      },
      image: {
        id: position.PostImage.id,
        url: position.PostImage.url,
      },
      position: {
        id: position.id,
        x: position.x,
        y: position.y,
        category: position.category,
        size: position.size,
        prix: position.prix,
      },
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve tagged posts' });
  }
};

// Get verified tagged posts
const getVerifiedTaggedPosts = async (req, res) => {
  const { brand } = req.params;

  try {
    const verifiedTaggedPositions = await PostPosition.findAll({
      where: { brand },
      include: [
        {
          model: PostImage,
          required: true, // Ensures only rows with valid PostImage
          include: [
            {
              model: Post,
              required: true, // Ensures only rows with valid Post
              where: { verified: true },
              include: [
                {
                  model: User,
                  attributes: ['id', 'full_name'],
                  required: false, // User can be optional
                },
              ],
            },
          ],
        },
      ],
    });    

    if (!verifiedTaggedPositions || verifiedTaggedPositions.length === 0) {
      return res.status(404).json({ error: 'No verified posts found for this brand' });
    }

    const posts = verifiedTaggedPositions
    .filter((position) => position.PostImage && position.PostImage.Post) // Filter out invalid rows
    .map((position) => ({
      postId: position.PostImage.Post.id,
      description: position.PostImage.Post.description,
      occasion: position.PostImage.Post.occasion,
      likesCount: position.PostImage.Post.likes_count,
      payTrend: position.PostImage.Post.pay_trend,
      verified: position.PostImage.Post.verified,
      createdAt: position.PostImage.Post.createdAt,
      updatedAt: position.PostImage.Post.updatedAt,
      user: position.PostImage.Post.User
        ? {
            id: position.PostImage.Post.User.id,
            fullName: position.PostImage.Post.User.full_name,
          }
        : null,
      image: {
        id: position.PostImage.id,
        url: position.PostImage.url,
      },
      position: {
        id: position.id,
        x: position.x,
        y: position.y,
        category: position.category,
        size: position.size,
        prix: position.prix,
      },
    }));


    console.log(JSON.stringify(verifiedTaggedPositions, null, 2));


    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve verified tagged posts' });
  }
};

module.exports = {
  createBrand,
  getBrandById,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandCart,
  getTaggedPosts,
  getVerifiedTaggedPosts,
};

const User = require('../models/User');
const Brand = require('../models/Brand');
const Auth = require('../models/Auth');

const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const PostPosition = require('../models/PostPosition');

const bcrypt = require('bcrypt');
const { Sequelize, Op } = require('sequelize');
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();
// Configurer Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Créer un vendeur
const createBrand = async (req, res) => {
  const { email, password, brand_name, profile_picture_url, region, phone_number } = req.body;

  try {
    // Vérifier si tous les champs nécessaires sont fournis
    if (!email || !password || !brand_name) {
      return res.status(400).json({ error: 'Email, password, and brand_name are required.' });
    }

    let uploadedImageUrl = '';

    // Vérifier si un fichier d'image est fourni et le télécharger sur Cloudinary
    if (profile_picture_url) {
      const uploadResult = await cloudinary.uploader.upload(profile_picture_url, {
        folder: 'profilepicture_brands', // Dossier où les images seront stockées dans Cloudinary
      });
      uploadedImageUrl = uploadResult.secure_url; // Récupérer l'URL sécurisée de l'image
    } else if (profile_picture_url) {
      // Si un URL d'image est fourni dans le body
      uploadedImageUrl = profile_picture_url;
    }

    // Générer un mot de passe haché
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer une marque liée à l'entrée Auth
    const newBrand = await Brand.create({
      brand_name,
      profile_picture_url: uploadedImageUrl, // Associer l'image téléchargée
      accountLevel: 'free', // Niveau par défaut si non fourni
    });

    // Créer une entrée Auth pour le vendeur
    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      profile_picture_url: uploadedImageUrl, // Utiliser l'URL téléchargée
      region: region || '', // En cas de valeur vide
      phone_number: phone_number,
      role: 'brand',
      users_id: newBrand.id,
    });


    // Répondre avec un succès
    res.status(201).json({
      message: 'Brand created successfully!',
      brandId: newBrand.id,
      authId: newAuth.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create brand' });
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
// Lire les informations d'un utilisateur
// const getUserById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findByPk(id, {
//       include: [{ model: Auth }],
//     });
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve user' });
//   }
// };
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

const getNamesBrand = async (req, res) => {
  const { search } = req.query;

  try {
    const brands = await Brand.findAll({
      attributes: ['id', 'brand_name'],
      where: search
        ? { brand_name: { [Op.like]: `${search}%` } } // Recherche commençant par les lettres
        : {},
    });

    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve brands' });
  }
};

const getTaggedPosts = async (req, res) => {
  const { brand_id } = req.params;
  const { verified } = req.query; // Récupération de la valeur de `verified` depuis la requête

  console.log(`Brand ID: ${brand_id}, Verified: ${verified}`);

  // Vérifier si `verified` est bien un booléen
  const isVerified = verified === "true";

  try {
    const taggedPositions = await PostPosition.findAll({
      where: { brand_id, verified: isVerified }, // Filtrage par `verified`
      include: [
        {
          model: PostImage,
          include: [
            {
              model: Post,
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "full_name"], // Récupère seulement l'ID et le nom
                },
              ],
            },
          ],
        },
      ],
    });

    if (taggedPositions.length === 0) {
      return res.status(404).json({ error: "No posts found for this brand" });
    }

    // Récupérer les IDs uniques des utilisateurs pour éviter de faire plusieurs requêtes inutiles
    const userIds = [
      ...new Set(taggedPositions.map((pos) => pos.PostImage.Post?.user?.id).filter((id) => id)),
    ];

    // Requête séparée pour récupérer les images de profil des utilisateurs
    const authData = await Auth.findAll({
      where: { users_id: userIds },
      attributes: ["users_id", "profile_picture_url"],
    });

    // Créer un objet clé-valeur pour accéder rapidement aux images de profil par `users_id`
    const authMap = authData.reduce((acc, auth) => {
      acc[auth.users_id] = auth.profile_picture_url;
      return acc;
    }, {});

    // Transformer les données pour inclure `profile_picture_url`
    const posts = taggedPositions.map((position) => {
      const post = position.PostImage.Post || {};
      const user = post.user || {};

      return {
        postId: post.id || null,
        description: post.description || "",
        occasion: post.occasion || "",
        likesCount: post.likes_count || 0,
        payTrend: post.trend || 0,
        verified: position.verified,
        createdAt: post.createdAt || null,
        updatedAt: post.updatedAt || null,
        user: {
          id: user.id,
          fullName: user.full_name,
          profile_picture_url: authMap[user.id] || "", // Associer l'image de profil
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
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch post by ID and include associated images and positions filtered by brand
const getPostById = async (id, brand) => {
  try {
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name'],
        },
        {
          model: PostImage,
          include: [
            {
              model: PostPosition,
              where: { brand },
              required: false,  // Only include PostPosition if it matches the brand
            },
          ],
        },
      ],
    });
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Approve or reject the post position based on the provided brand
const approvePost = async (req, res) => {
  const { id, brand } = req.params;
  try {
    // Get the post by ID (no need for `brand` as a query parameter here)
    const post = await getPostById(id, brand);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Your existing logic for approving/rejecting the post
    const postPosition = await PostPosition.findOne({
      where: {
        post_id: post.id,
        brand,
        post_image_id: {
          [Sequelize.Op.in]: post.PostImages.map((img) => img.id), // Ensure PostImages are included
        },
      },
    });

    if (!postPosition) {
      return res.status(404).json({ error: 'PostPosition not found for the brand' });
    }

    // Update the post position with the provided data
    postPosition.verified = req.body.verified || postPosition.verified;
    postPosition.prix = req.body.prix || postPosition.prix;
    postPosition.size = req.body.size || postPosition.size;
    postPosition.category = req.body.category || postPosition.category;

    await postPosition.save();

    return res.status(200).json({
      message: 'Post position updated and approval processed',
      postPosition,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve/reject post' });
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

const getBrandVisitorCart=async(req,res)=>{
  try{
    const {id}=req.params;
    const auth= await Auth.findOne({
      where:{role:"brand",users_id:id},
      attributes:["profile_picture_url"]
    })

    if(!auth){
      return res.status(404).json({error:"Brand not found"})
    }
    const brand=await Brand.findOne({where:{id:id}})
    if(!brand){
      return res.status(404).json({error:"Brand not found"})
    }
    res.status(200).json({
        brand_name: brand.brand_name,
        account_level: brand.accountLevel,
        total_sales: brand.total_sales,
        profile_picture_url: auth.profile_picture_url || '', // Photo de profil
      });
  }catch(e){
    console.error(e);
    res.status(500).json({error:"Failed to get brand visitor cart"})
  }
};

module.exports = {
  createBrand,
  getBrandById,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandCart,
  getNamesBrand,
  getTaggedPosts,
  // getVerifiedTaggedPosts,
  approvePost,
  getBrandVisitorCart
  
};
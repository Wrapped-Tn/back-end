const bcrypt = require('bcrypt'); // Importer bcrypt
const User = require('../models/User');
const Grade = require('../models/Grade');
const Auth = require('../models/Auth');
const Post = require('../models/Post');

const { generateCode, verificationCodes, transporter } = require('../controllers/Auth/authentification'); 

const moment = require('moment'); // Importer moment pour le formatage des dates
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();

// Configurer Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// Créer un utilisateur avec grade et auth
const createUserWithGrade = async (req, res) => {

  const {
    email,
    password,
    full_name,
    sexe,
    phone_number,
    profile_picture_url,
    region,
    birthdate,
    user_type
  } = req.body;

  console.log('Data sent by user during signUp: ', req.body);

  try {
    // Check if the email already exists
    const existingAuth = await Auth.findOne({ where: { email } });
    if (existingAuth) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload the profile picture to Cloudinary if provided
    let profilePictureUrl = '';
    if (profile_picture_url) {
      const uploadResult = await cloudinary.uploader.upload(profile_picture_url, {
        folder: 'profilepicture',
      });
      profilePictureUrl = uploadResult.secure_url;
    }

    // Create the Auth entry for the user
    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      full_name,
      sexe,
      phone_number: phone_number || '',
      profile_picture_url: profilePictureUrl || '',
      region: region || '',
      role: 'user',
      birthdate,
      isActive: false, // Account inactive until verified
    });
    

    // Generate a 4-digit verification code
    const code = generateCode(); // Use the imported function
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
        authId: newAuth.id,
      });
    });
  } catch (error) {
    console.error('Error creating Auth:', error);
    res.status(500).json({ error: 'Failed to create Auth and send verification code.' });
  }
};

const getUserWithAuth = async (req, res) => {
  const { user_id } = req.params;

  try {
    // Get user data
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get auth data
    const auth = await Auth.findOne({
      where: { users_id: user_id },
      attributes: [
        'email',
        'phone_number',
        'profile_picture_url',
        'region',
        'role',
        'password',
        'creation_date',
        'last_login'
      ]
    });

    if (!auth) {
      return res.status(404).json({ message: 'Auth data not found' });
    }

    // Return combined data
    res.status(200).json({
      user_info: {
        id: user.id,
        full_name: user.full_name,
        grade_id: user.grade_id,
        commission_earned: user.commission_earned,
        sexe: user.sexe,
        birthdate: user.birthdate
      },
      auth_info: auth
    });

  } catch (error) {
    console.error('Error fetching user with auth:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};

const updateUserWithAuth = async (req, res) => {
  const { user_id } = req.params;

  const {
    // User table fields
    full_name,
    sexe,
    birthdate,
    // Auth table fields
    email,
    phone_number,
    profile_picture_url,
    region,
    current_password,  
    password     
  } = req.body;
  
  try {
    // Find user
    const user = await User.findByPk(user_id);
    console.log('Finding user with ID:', user_id);
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find auth
    const auth = await Auth.findOne({ where: { users_id: user_id } });
    if (!auth) {
      return res.status(404).json({ message: 'Auth data not found' });
    }
    const isPasswordValid = await bcrypt.compare(current_password, auth.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update User table data
    await user.update({
      full_name: full_name || user.full_name,
      sexe: sexe || user.sexe,
      birthdate: birthdate || user.birthdate
    });

    // Prepare Auth update data
    const authUpdateData = {
      email: email || auth.email,
      phone_number: phone_number || auth.phone_number,
      profile_picture_url: profile_picture_url || auth.profile_picture_url,
      region: region || auth.region
    };

    // If password is provided, hash it before updating
    if (password) {
      const salt = await bcrypt.genSalt(10);
      authUpdateData.password = await bcrypt.hash(password, salt);
    }

    // Update Auth table data
    await auth.update(authUpdateData);

    // Get updated data
    const updatedUser = await User.findByPk(user_id);
    const updatedAuth = await Auth.findOne({
      where: { users_id: user_id },
      attributes: [
        'email',
        'phone_number',
        'profile_picture_url',
        'region',
        'role',
        'creation_date',
        'last_login'
      ]
    });

    res.status(200).json({
      message: 'User data updated successfully',
      user_info: {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        grade_id: updatedUser.grade_id, // Only returned, not updateable
        commission_earned: updatedUser.commission_earned, // Only returned, not updateable
        sexe: updatedUser.sexe,
        birthdate: updatedUser.birthdate
      },
      auth_info: updatedAuth
    });

  } catch (error) {
    console.error('Error updating user with auth:', error);
    res.status(500).json({ 
      message: 'Error updating user data', 
      error: error.message 
    });
  }
};
// Lire les informations d'un utilisateur
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

// Récupérer tous les utilisateurs
const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Auth }],
    });
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: 'No users found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone_number, region } = req.body;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      user.full_name = full_name || user.full_name;
      await user.save();

      if (user.Auth) {
        user.Auth.phone_number = phone_number || user.Auth.phone_number;
        user.Auth.region = region || user.Auth.region;
        await user.Auth.save();
      }

      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [{ model: Auth }],
    });
    if (user) {
      if (user.Auth) {
        await user.Auth.destroy();
      }
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Récupérer le panier d'un utilisateur
const getUserCart = async (req, res) => {
  const { idUser,idAuth } = req.body;

  try {
    const user = await User.findByPk(idUser);
    const auth=await Auth.findByPk(idAuth)

    if (user) {
      res.status(200).json({
        grade: user.grade_id,
        full_name: user.full_name,
        profile_picture_url: auth.profile_picture_url || '', 
        role:auth.role,
        user_id:auth.users_id
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

// Update user profile picture
const updatePofileImg=async(req,res)=>{
try{
  const {id}=req.params
  const {profile_picture_url}=req.body
  const user=await Auth.findByPk(id)
  if(user){
    user.profile_picture_url=profile_picture_url
    await user.save()
    res.status(200).json({message:'Profile picture updated successfully'})
    }else{
      res.status(404).json({message:'User not found'})
  }
}catch(e){
  res.status(500).json({message:'An error occurred',error:e.message})
}
}

const getSomeOneInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user information
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['full_name', 'profile_picture_url'],
      include: [
        {
          model: Grade,
          as: 'grade',
          attributes: ['grade_name'], // Include grade name
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total sales
    const totalSales = await PostPosition.count({
      where: { brand: user.brand_name }, // Adjust depending on your associations
    });

    return res.status(200).json({
      fullName: user.full_name,
      profilePicture: user.profile_picture_url,
      grade: user.grade ? user.grade.grade_name : 'Unknown',
      totalSales,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getSomeOnePosts = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user posts with images and positions
    const posts = await Post.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PostImage,
          as: 'images',
          attributes: ['url'],
          include: [
            {
              model: PostPosition,
              as: 'positions',
              attributes: ['x', 'y', 'brand', 'category', 'size', 'prix'],
            },
          ],
        },
      ],
      attributes: ['id', 'description', 'likes_count', 'pay_trend', 'verified', 'createdAt'],
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUserWithGrade,
  getUserById,
  updateUser,
  deleteUser,
  getAllUser,
  getUserCart,
  updatePofileImg,
  getUserWithAuth,
  updateUserWithAuth
};

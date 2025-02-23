const express = require('express');
const cors = require('cors');
const db = require ('./config/index');

require("dotenv").config();

// require('dotenv').config();
// require('./Middleware Passport/passport-setup');
const app = express()
const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');

// Start Added By Youssef
const CartRoutes = require('./routes/CartR');
const OrderRoutes = require('./routes/OrderR');
const OrderBrandRoutes = require('./routes/OrderBrand');

const PostRoutes = require('./routes/PostR');
const LikePostRoutes = require('./routes/LikePostR');
const DiscoveryRoutes =  require('./routes/DiscoveryR');
const RatingRoutes = require('./routes/RatingR');

// End Added By Youssef

const userRoutes = require('./routes/UserR');
const filterRoutes = require('./routes/FilterR');
const commissionRoutes = require('./routes/CommissonR');
const transactionRoutes = require('./routes/TransactionR');
const gradeRoutes = require('./routes/GradeR');
const authRoutes = require('./routes/auth/authentificationR');
const imageUpload =require('./routes/PropsR');
const BrandRoutes =require('./routes/BrandR');
const commentRoutes = require('./routes/CommentR');
const articleRoutes = require('./routes/ArticleR');
const adressRoutes = require('./routes/AdressR');
const checkoutRoutes = require('./routes/CheckoutR')
// const likesRoutes = require('./routes/LikesR');

// Updated By Youssef
const savePostRoutes = require('./routes/SavePostR');
// End Updated By Youssef

// const authRoutesGoFb = require('./routes/auth/authGoogleFb');
const path = require('path');
const uploadRoutes = require('./routes/PropsR');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname + "/../react-client/dist"));
app.use(express.urlencoded({ extended: true,limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());
// Routes pour les utilisateurs
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
// Start Added By Youssef
app.use('/api/carts', CartRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/ordersbrand', OrderBrandRoutes);
app.use('/api/checkout',checkoutRoutes)
app.use('/api/posts', PostRoutes);
app.use('/api/likePosts', LikePostRoutes);
app.use('/api/discovery', DiscoveryRoutes);
app.use('/api/ratings', RatingRoutes);

// End Added By Youssef

// Routes pour les vendeurs



// Routes pour les filtres
app.use('/api/filters', filterRoutes);

// Routes pour les commissions
app.use('/api/commissions', commissionRoutes);



// Routes pour les transactions
app.use('/api/transactions', transactionRoutes);

// Utiliser les routes d'authentification
app.use('/api/auth', authRoutes);

// Utiliser les routes de grades
app.use('/api/grades', gradeRoutes);

// Utiliser les routes d'upload d'image
app.use('/api/props', imageUpload);

// Utiliser les routes de brands
app.use('/api/brands', BrandRoutes)

// Utiliser les routes de commentaires
app.use('/api/comments', commentRoutes);


// Utiliser les routes de savings
app.use('/api/savings', savePostRoutes);

// Utiliser les routes de l'adress
app.use('/api/adresses', adressRoutes);


// Middleware pour les sessions
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'secret', // Choisis un secret fort
//     resave: false,
//     saveUninitialized: true,
//   }));

  // Autres middlewares, routes, etc.
// app.use('api/authGoFb', authRoutesGoFb);

// Serve static files from uploads directory

app.use('/uploads', express.static('uploads'));

app.use('/posts', express.static(path.join(__dirname, 'posts')));

// Use upload routes
app.use('/api', uploadRoutes);


const PORT =  process.env.SERVER_PORT || 3307;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
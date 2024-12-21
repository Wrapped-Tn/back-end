const express = require('express');
const cors = require('cors');
const db = require ('./config/index.JS')
// require('dotenv').config();
// require('./Middleware Passport/passport-setup');
const app = express()
const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
const userRoutes = require('./routes/UserR');
const articleRoutes = require('./routes/ArticleR');
const filterRoutes = require('./routes/FilterR');
const commissionRoutes = require('./routes/CommissonR');
const itemFilterRoutes = require('./routes/ItemFilterR');
const transactionRoutes = require('./routes/TransactionR');
const gradeRoutes = require('./routes/GradeR');
const authRoutes = require('./routes/auth/authentificationR');
const imageUpload =require('./routes/PropsR');
const BrandRoutes =require('./routes/BrandR');
const commentsRoutes = require('./routes/CommentsR');
const likesRoutes = require('./routes/LikesR');
const savingsRoutes = require('./routes/SavingsR');
// const authRoutesGoFb = require('./routes/auth/authGoogleFb');
const path = require('path');
const uploadRoutes = require('./routes/PropsR');


const PORT =  3000;

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

// Routes pour les vendeurs

// Routes pour les articles
app.use('/api/articles', articleRoutes);

// Routes pour les filtres
app.use('/api/filters', filterRoutes);

// Routes pour les commissions
app.use('/api/commissions', commissionRoutes);

// Routes pour les associations article-filtre
app.use('/api/itemFilters', itemFilterRoutes);

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
app.use('/comments', commentsRoutes);

// utiliser e routes de likes
app.use('/likes', likesRoutes);

// Utiliser les routes de savings
app.use('/savings', savingsRoutes);

// Middleware pour les sessions
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'secret', // Choisis un secret fort
//     resave: false,
//     saveUninitialized: true,
//   }));

  // Autres middlewares, routes, etc.
// app.use('api/authGoFb', authRoutesGoFb);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use upload routes
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
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
const imageUpload =require('./routes/PropsR')
// const authRoutesGoFb = require('./routes/auth/authGoogleFb');
const PORT =  3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/../react-client/dist"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
// Middleware pour les sessions
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'secret', // Choisis un secret fort
//     resave: false,
//     saveUninitialized: true,
//   }));

  // Autres middlewares, routes, etc.
// app.use('api/authGoFb', authRoutesGoFb);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
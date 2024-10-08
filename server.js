const express = require('express');
const cors = require('cors');
const db = require ('./config/index.JS')
const app = express()
const bodyParser = require('body-parser');

const userRoutes = require('./routes/UserR');
const sellerRoutes = require('./routes/SellerR');
const articleRoutes = require('./routes/ArticleR');
const filterRoutes = require('./routes/FilterR');
const commissionRoutes = require('./routes/CommissonR');
const itemFilterRoutes = require('./routes/ItemFilterR');
const transactionRoutes = require('./routes/TransactionR');
const authRoutes = require('./routes/auth/authentificationR');

const PORT =  3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/../react-client/dist"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes pour les utilisateurs
app.use('/api/users', userRoutes);

// Routes pour les vendeurs
app.use('/api/sellers', sellerRoutes);

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

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
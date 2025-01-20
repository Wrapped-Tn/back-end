const express = require('express');
const router = express.Router();
const BrandC = require('../controllers/BrandC');  // Ajustez en fonction du chemin de votre contrôleur

// Créer une nouvelle marque
router.post('/create', BrandC.createBrand);

// Récupérer une marque par ID
router.get('/:id', BrandC.getBrandById);

router.post('/searchbyname', BrandC.getNamesBrand);////api/brands/searchbyname?search=brand_name

// Récupérer toutes les marques
router.get('/', BrandC.getAllBrands);

// Mettre à jour une marque
router.put('/:id', BrandC.updateBrand);

// Supprimer une marque
router.delete('/:id', BrandC.deleteBrand);

// Récupérer le panier d'une marque
router.post('/BrandCart', BrandC.getBrandCart);

module.exports = router;

const express = require('express');
const router = express.Router();
const BrandC = require('../controllers/BrandC');  // Adjust according to your controller path

// Créer une nouvelle marque
router.post('/create', BrandC.createBrand);

// Récupérer une marque par ID
router.get('/:id', BrandC.getBrandById);

// Récupérer les marques par leur nom (search by name)
router.post('/searchbyname', BrandC.getNamesBrand); // api/brands/searchbyname?search=brand_name

// Récupérer toutes les marques
router.get('/', BrandC.getAllBrands);

// Mettre à jour une marque
router.put('/:id', BrandC.updateBrand);

// Supprimer une marque
router.delete('/:id', BrandC.deleteBrand);

// Récupérer le panier d'une marque
router.post('/BrandCart', BrandC.getBrandCart);

router.get('/BrandVisitorCart/:id', BrandC.getBrandVisitorCart);

// Récupérer les posts où la marque a été taguée
router.get('/taggedPosts/:brand_id', BrandC.getTaggedPosts); 

// Récupérer les posts vérifiés pour lesquels la marque a été taguée

// Approuver ou rejeter un post
router.put('/approve/:id/:brand', BrandC.approvePost); // api/brands/:id/approve/:brand

module.exports = router;

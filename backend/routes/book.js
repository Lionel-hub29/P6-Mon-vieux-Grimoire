//importations des modules et middlewares
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

//Définition des routes, appelle des fonctions et middlewares d'authentification ou d'envoi et stockage des fichiers 
router.get('/', bookCtrl.getAllBooks);//
router.get('/bestrating', bookCtrl.getBestRatings);// créer pour la meilleur notation
router.get('/:id', bookCtrl.getOneBook);//
router.post('/', auth, multer, bookCtrl.createBook);//
router.post('/:id/rating', auth, bookCtrl.addRating);
router.put('/:id', auth, multer, bookCtrl.modifyBook);//
router.delete('/:id', auth, bookCtrl.deleteBook);//

//exportation du router
module.exports = router;
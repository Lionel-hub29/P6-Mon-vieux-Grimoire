//importation du module express, creation routeur
const express = require('express');
const router = express.Router();

//importation du contrôleur utilisateur
const userCtrl = require('../controllers/user');


//définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//exportation du routeur
module.exports = router;
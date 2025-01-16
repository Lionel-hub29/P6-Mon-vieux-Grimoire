const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//définition la création d'un utilisateur
exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10) //hachage du mot de passe
        .then(hash => {
            const user = new User({ //création nouvel utilisateur
                email: req.body.email,
                password: hash
            });
            user.save() //sauvegarde dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//défini la connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //recherche de l'utilisateur
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password) //compare le mot de passe entré et celui stocké haché
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' } //temps defini de validité token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


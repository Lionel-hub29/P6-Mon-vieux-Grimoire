//importation de modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//définition du shema d'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //unique renvoi à un contrôle que l'email existe une seule fois
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//exportation du modèle
module.exports = mongoose.model('User', userSchema);
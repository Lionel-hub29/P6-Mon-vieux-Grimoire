//configuration framework express, mongoose et creation de l'application express
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

//connexion à mon compte sur MongoDb
mongoose.connect('mongodb+srv://lionelbertrand83:Dev2024@cluster0.oskou.mongodb.net/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'mvg_db'
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//configuration des en-têtes CORS (cross origin ressource sharing)    
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//traitement des requêtes  
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/images', express.static(path.join(__dirname, 'images')));

//routes API
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

//exportation application
module.exports = app;
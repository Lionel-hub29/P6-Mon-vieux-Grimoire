const Book = require("../models/Book");
const fs = require("fs");

//création d'un livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    console.log(bookObject);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId, //assigne la création à un unique id 
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
    });

    book
        .save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//Récupération d'un livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id,
    })
        .then((book) => {
            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

//modification d'un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) { //controle de l'id pour le modifier
                res.status(401).json({ message: "Not authorized" });
            } else {
                Book.updateOne( //mise à jour du livre
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ message: "Objet modifié!" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//suppression d'un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) { //controle de l'id pour le supprimer
                res.status(401).json({ message: "Non autorisé" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Objet supprimé !" });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

//récupération de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
        });
};

//ajouter une note sur un livre
exports.addRating = (req, res, next) => {
    Book.findOne({
        _id: req.params.id,
    })
        .then((book) => {
            const { userId, rating } = req.body;

            const ratings = book.ratings.map((note) => note.grade);

            let averageNote = 0;

            [...ratings, rating].forEach((note) => {
                averageNote += note; //incrémentation de la note
            });

            book.ratings.push({
                userId,
                grade: rating,
            });

            book.averageRating = averageNote / [...ratings, rating].length; //calcule de la moyenne

            book
                .save() //mise à jour de la moyenne
                .then((updatedBook) => res.status(200).json(updatedBook))
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

//récupération des meilleurs livres
exports.getBestRatings = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3) //nb de livre recherché
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

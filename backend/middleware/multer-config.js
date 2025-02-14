const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Configuration Multer : stockage en mémoire pour traitement
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Middleware de conversion en WebP
const convertImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(); // Aucun fichier envoyé
        }

        // Générer un nom sécurisé
        const originalName = path.parse(req.file.originalname).name.replace(/\s+/g, "_");
        const newFileName = `${originalName}_${Date.now()}.webp`;
        const outputPath = path.join(__dirname, "../images", newFileName);

        // Conversion en WebP et enregistrement
        await sharp(req.file.buffer)
            .resize(206, 260, { fit: "cover" }) // Taille fixe
            .toFormat("webp", { quality: 80 }) // Conversion en WebP
            .toFile(outputPath);

        // Remplace les infos du fichier dans la requête
        req.file.filename = newFileName;
        req.file.path = outputPath;
        req.file.mimetype = "image/webp";

        next();
    } catch (error) {
        console.error("Erreur de conversion :", error);
        res.status(500).json({ message: "Erreur lors de la conversion de l'image" });
    }
};

module.exports = { upload, convertImage };
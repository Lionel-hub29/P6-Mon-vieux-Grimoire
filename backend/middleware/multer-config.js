const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");


const MIME_TYPES = {
    'image/jpg': 'webp',
    'image/jpeg': 'webp',
    'image/webp': 'webp',
    'image/png': 'webp'
};


const fileFilter = (req, file, cb) => {
    if (MIME_TYPES[file.mimetype]) {
        cb(null, true); // Accepter le fichier
    } else {
        cb(new Error("Type de fichier non autorisé. Formats acceptés : jpg, jpeg, png, webp"), false);
    }
};

// Configuration Multer : stockage en mémoire pour traitement avec limitation et filtre
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mo max
    fileFilter //regarde le type
}).single("image");


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
            .resize(206, 260, { fit: "contain" }) // Taille fixe - image ajustée
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
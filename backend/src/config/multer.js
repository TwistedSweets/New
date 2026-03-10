const multer = require("multer");
const path = require("path");

// Multer configuracion
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Carpeta donde se guardarán los archivos subidos.
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // Nombre del archivo con extensión.
    }
});

// Validar que solo se suban imagenes maximo 5MB
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: (req, file, cb) => {
        // Tuve problemas con POSTMAN, no me reconocia el mimetype de las imagenes, asi que agregue una validacion extra por extension.
        const allowedMime = ["image/jpeg", "image/png", "image/webp"];
        const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

        const ext = path.extname(file.originalname).toLowerCase();

        // Postman manda "Content-Type: application/octet-stream" un archivo binario generico, los navegadores mandan
        // image/jpeg, image/png, etc. Asi que validamos ambos casos para evitar problemas con Postman.
        if (allowedMime.includes(file.mimetype) || allowedExt.includes(ext)) {
            return cb(null, true);
        }

        cb(new Error("Solo se permiten archivos de imagen"));
    }
});

module.exports = {
    upload
};
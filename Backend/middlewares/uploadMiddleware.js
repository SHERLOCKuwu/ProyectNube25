const multer = require("multer");
const path = require("path");

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    },
});

// Filtrar tipos de archivos 
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Tipo de archivo no permitido"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, 
});

module.exports = upload;

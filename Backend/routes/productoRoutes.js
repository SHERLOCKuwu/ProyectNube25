const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();
const productoController = require('../controllers/productoController');
const auth = require('../auth/auth');
const upload = require("../middlewares/uploadMiddleware");

// Middleware de validación de ID
const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID no válido' });
    }
    next();
};

// Rutas de productos
router.post('/productos', auth.authenticate, productoController.createproductoMiel);
router.get('/productos', productoController.getAllproductoMiel);
router.get('/productos/paginados', productoController.getAllproductoMielPaginacion);
router.get('/productos/:id', validateId, productoController.getproductoMielById);
router.put('/productos/:id', auth.authenticate, validateId, productoController.updateproductoMiel);
router.delete('/productos/:id', auth.authenticate, validateId, productoController.deleteproductoMiel);

// Ruta para subir imágenes
router.post('/productos/:id/imagen', 
    auth.authenticate, 
    validateId, 
    upload.single("imagen"), 
    productoController.uploadFile
);

// Ruta para listar imágenes
router.get('/productos/imagenes/listado', productoController.getUploadedFiles);

module.exports = router;
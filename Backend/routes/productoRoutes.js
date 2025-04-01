const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const productoController = require('../controllers/productoController');
const auth = require('../auth/auth');
const upload = require("../middlewares/uploadMiddleware");

// Middleware de validación de ID reutilizable
const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ 
            success: false,
            message: 'ID de MongoDB no válido',
            details: `El ID proporcionado (${req.params.id}) no tiene el formato correcto`
        });
    }
    next();
};

// Configuración de rutas con prefijo '/api' (debe coincidir con tu app.js)
// Rutas PÚBLICAS (acceso sin autenticación)
router.get('/', productoController.getAllproductoMiel); // GET /api/productos
router.get('/paginados', productoController.getAllproductoMielPaginacion); // GET /api/productos/paginados
router.get('/:id', validateId, productoController.getproductoMielById); // GET /api/productos/:id
router.get('/imagenes/listado', productoController.getUploadedFiles); // GET /api/productos/imagenes/listado

// Rutas PROTEGIDAS (requieren autenticación)
router.post('/', 
    auth.authenticate, 
    productoController.createproductoMiel
); // POST /api/productos

router.put('/:id', 
    auth.authenticate, 
    validateId, 
    productoController.updateproductoMiel
); // PUT /api/productos/:id

router.delete('/:id', 
    auth.authenticate, 
    validateId, 
    productoController.deleteproductoMiel
); // DELETE /api/productos/:id

router.post('/:id/imagen', 
    auth.authenticate, 
    validateId, 
    upload.single("imagen"),  // 'imagen' debe coincidir con el name del input file
    productoController.uploadFile
); // POST /api/productos/:id/imagen

module.exports = router;
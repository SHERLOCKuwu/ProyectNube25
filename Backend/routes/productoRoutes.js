const productoController = require('../controllers/productoController');
const auth = require('../auth/auth');
const upload = require("../middlewares/uploadMiddleware");
const { validateId } = require('../middlewares/validators'); // Asumiendo que crearás este middleware

module.exports = (app) => {
    // API v1 - Rutas de productos
    const basePath = '/api/v1/productos';
    
    // Crear un nuevo producto (requiere autenticación)
    app.post(
        basePath,
        auth.authenticate, // Corregido typo "aunthenticate" -> "authenticate"
        productoController.createproductoMiel
    );

    // Obtener todos los productos (público)
    app.get(
        basePath,
        productoController.getAllproductoMiel
    );

    // Obtener productos paginados (público)
    app.get(
        `${basePath}/paginados`,
        productoController.getAllproductoMielPaginacion
    );

    // Obtener un producto específico (público)
    app.get(
        `${basePath}/:id`,
        validateId, // Middleware para validar el formato del ID
        productoController.getproductoMielById
    );

    // Actualizar un producto (requiere autenticación)
    app.put(
        `${basePath}/:id`,
        auth.authenticate,
        validateId,
        productoController.updateproductoMiel
    );

    // Eliminar un producto (requiere autenticación)
    app.delete(
        `${basePath}/:id`,
        auth.authenticate,
        validateId,
        productoController.deleteproductoMiel
    );

    // Subir imagen para un producto (requiere autenticación)
    app.post(
        `${basePath}/:id/imagen`,
        auth.authenticate,
        validateId,
        upload.single("imagen"), // Cambiado "file" por "imagen" para mayor claridad
        productoController.uploadFile
    );

    // Obtener productos con imágenes (público)
    app.get(
        `${basePath}/imagenes/listado`,
        productoController.getUploadedFiles
    );
};


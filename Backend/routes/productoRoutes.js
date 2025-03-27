const productoController = require('../controllers/productoController');
const auth = require('../auth/auth');
const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { uploadFile } = require("../controllers/productoController");


module.exports = (app) => {
    // crear un nuevo producto de miel 
    app.post('/producto', auth.aunthenticate, productoController.createproductoMiel);

    // obtener todos los productos de miel
    app.get('/producto', productoController.getAllproductoMiel);

    app.get('/productoPaginacion', productoController.getAllproductoMielPaginacion);

    // obtener un producto de miel por su ID
    app.get('/producto/:id', productoController.getproductoMielById);

    // actualizar un producto de miel por su ID
    app.put('/producto/:id', auth.aunthenticate, productoController.updateproductoMiel);

    // eliminar un producto de miel por su ID

    app.delete('/producto/:id', auth.aunthenticate,  productoController.deleteproductoMiel);

    //auth.authorizeAdmin,
    // subir imagen
    
    app.post("/productoMiel/:id/upload", upload.single("file"), uploadFile);
   
    app.get("/productoMiel", productoController.getUploadedFiles);
       
}



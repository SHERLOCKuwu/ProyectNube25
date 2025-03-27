// routes/tipoProducto.js
const express = require('express');
const tipoProductoController = require('../controllers/tipoProductoController');

module.exports = (app) => {
    app.post('/tipoproducto', tipoProductoController.createTipoProducto);
    app.get('/tipoproducto', tipoProductoController.getAllTipoProductos);
};


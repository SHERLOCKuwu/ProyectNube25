const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
});

const TipoProducto = mongoose.model('TipoProducto', tipoProductoSchema);
module.exports = TipoProducto;

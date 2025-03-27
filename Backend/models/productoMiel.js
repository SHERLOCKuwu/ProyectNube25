const mongoose = require('mongoose');

const productoMielSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },
    //cantidad: { type: Number, required: true },
    precio: { type: Number, required: true },
    //urlImagen: { type: String, required: true },
    //descripcion: { type: String },
    fechaCaducidad: { type: Date },
    stock: { type: Number },
    
});

const productoMiel = mongoose.model('productoMiel', productoMielSchema);
module.exports = productoMiel;




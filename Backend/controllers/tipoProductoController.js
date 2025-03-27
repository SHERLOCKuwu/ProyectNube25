
const TipoProducto = require('../models/TipoProducto');

exports.createTipoProducto = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const newTipoProducto = new TipoProducto({ nombre, descripcion });
        const savedTipoProducto = await newTipoProducto.save();
        res.status(201).json(savedTipoProducto);
    } catch (error) {
        console.error("Error al crear TipoProducto:", error);
        res.status(500).send("Error en el servidor");
    }
};

exports.getAllTipoProductos = async (req, res) => {
    try {
        const tiposProductos = await TipoProducto.find();
        res.status(200).send(tiposProductos);
    } catch (err) {
        console.error("Error en getAllTipoProductos: ", err);
        res.status(500).send("Error en el servidor");
    }
};
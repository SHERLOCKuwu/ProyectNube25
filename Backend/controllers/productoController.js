const productoMiel = require('../models/productoMiel');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Crear un nuevo producto de miel
exports.createproductoMiel = async (req, res) => {
    try {
        const { nombre, tipo, precio, fechaCaducidad, stock } = req.body;

        // Validación mejorada
        if (!nombre || !tipo || !precio) {
            return res.status(400).json({ 
                message: "Nombre, tipo y precio son campos obligatorios" 
            });
        }

        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({
                message: "El precio debe ser un número positivo"
            });
        }

        if (stock && (isNaN(stock) || stock < 0)) {
            return res.status(400).json({
                message: "El stock debe ser un número positivo o cero"
            });
        }

        const nuevoProductoMiel = new productoMiel({
            nombre,
            tipo,
            precio,
            fechaCaducidad: fechaCaducidad || undefined,
            stock: stock || undefined
        });

        const productoGuardado = await nuevoProductoMiel.save();
        res.status(201).json({
            message: "Producto creado exitosamente",
            producto: productoGuardado
        });
    } catch (err) {
        console.error("Error en createproductoMiel: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Obtener todos los productos de miel con paginación
exports.getAllproductoMielPaginacion = async (req, res) => {
    try {
        const { page = 1, limit = 5, nombre } = req.query;
        const filter = {};
        
        if (nombre) filter.nombre = { $regex: nombre, $options: 'i' };

        const productosMiel = await productoMiel.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await productoMiel.countDocuments(filter);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            productos: productosMiel,
        });
    } catch (err) {
        console.error("Error en getAllproductoMielPaginacion: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Obtener todos los productos sin paginación
exports.getAllproductoMiel = async (req, res) => {
    try {
        const productosMiel = await productoMiel.find();
        res.status(200).json(productosMiel);
    } catch (err) {
        console.error("Error en getAllproductoMiel: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Obtener un producto por su ID
exports.getproductoMielById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        const producto = await productoMiel.findById(id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        
        res.status(200).json(producto);
    } catch (err) {
        console.error("Error en getproductoMielById: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Actualizar un producto por su ID
exports.updateproductoMiel = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, precio, fechaCaducidad, stock } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        // Validación mejorada
        if (!nombre || !tipo || !precio) {
            return res.status(400).json({ 
                message: "Nombre, tipo y precio son campos obligatorios" 
            });
        }

        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({
                message: "El precio debe ser un número positivo"
            });
        }

        if (stock && (isNaN(stock) || stock < 0)) {
            return res.status(400).json({
                message: "El stock debe ser un número positivo o cero"
            });
        }

        const productoActualizado = await productoMiel.findByIdAndUpdate(
            id,
            {
                nombre,
                tipo,
                precio,
                fechaCaducidad: fechaCaducidad || undefined,
                stock: stock || undefined
            },
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Producto actualizado exitosamente",
            producto: productoActualizado
        });
    } catch (err) {
        console.error("Error en updateproductoMiel: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Eliminar un producto por su ID
exports.deleteproductoMiel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        const productoEliminado = await productoMiel.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Producto eliminado exitosamente",
            producto: productoEliminado
        });
    } catch (err) {
        console.error("Error en deleteproductoMiel: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Subir archivo/imagen para un producto
exports.uploadFile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID no válido" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No se subió ningún archivo" });
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ 
                message: "Solo se permiten imágenes (PNG, JPG, JPEG, GIF, BMP)" 
            });
        }

        const newFileName = `${id}${fileExtension}`;
        const uploadDir = path.join(__dirname, '..', 'uploads');
        const newFilePath = path.join(uploadDir, newFileName);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.renameSync(req.file.path, newFilePath);

        const fileDetails = {
            Nombre_Archivo: newFileName,
            MimeType: req.file.mimetype,
            Size: req.file.size,
            Ruta: path.join('uploads', newFileName),
        };

        const productoActualizado = await productoMiel.findByIdAndUpdate(
            id,
            {
                urlImagen: fileDetails.Ruta,
                file: fileDetails,
            },
            { new: true }
        );

        if (!productoActualizado) {
            // Eliminar el archivo si no se pudo actualizar el producto
            fs.unlinkSync(newFilePath);
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({
            message: "Archivo subido exitosamente",
            producto: productoActualizado,
            file: fileDetails
        });
    } catch (err) {
        console.error("Error al subir el archivo:", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};

// Obtener archivos subidos
exports.getUploadedFiles = async (req, res) => {
    try {
        const productos = await productoMiel.find({ file: { $exists: true } })
            .select('_id nombre file');

        if (productos.length === 0) {
            return res.status(404).json({ message: "No hay archivos subidos" });
        }

        res.status(200).json({
            count: productos.length,
            archivos: productos
        });
    } catch (err) {
        console.error("Error al recuperar archivos: ", err);
        res.status(500).json({ 
            message: "Error en el servidor",
            error: err.message 
        });
    }
};
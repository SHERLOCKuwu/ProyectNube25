const productoMiel = require('../models/productoMiel');
const TipoProducto = require('../models/TipoProducto');
const path = require('path');
const fs = require('fs'); 
const mongoose = require('mongoose');


// Crear un nuevo producto de miel
exports.createproductoMiel = async (req, res) => {
    try {
        const { nombre, tipo, precio, fechaCaducidad, stock } = req.body;

        
        if (!nombre || !tipo || !precio ) {
            return res.status(400).send("Faltan campos obligatorios");
        }

        
        

        
        

        const nuevoProductoMiel = new productoMiel({
            nombre,
            tipo,
           // cantidad,
            precio,
            //urlImagen,
            //descripcion,
            fechaCaducidad,
            stock,
            //ID_tipoProducto
        });

        const productoGuardado = await nuevoProductoMiel.save();
        res.status(201).send(productoGuardado);
    } catch (err) {
        console.error("Error en createproductoMiel: ", err);
        res.status(500).send("Error en el servidor");
    }
};




// Obtener todos los productos de miel
exports.getAllproductoMielPaginacion = async (req, res) => {
    try {
        
        const { page = 3, limit = 5, nombre } = req.query;

       
        const filter = {};
        if (nombre) filter.nombre = { $regex: nombre, $options: 'i' }; 
        //if (tipo) filter.tipo = { $regex: tipo, $options: 'i' };

        
        const productosMiel = await productoMiel
            .find(filter)
            //.populate('ID_tipoProducto')
            .skip((page - 1) * limit) 
            .limit(parseInt(limit)); 

       
        const total = await productoMiel.countDocuments(filter);

        res.status(200).send({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            productos: productosMiel,
        });
    } catch (err) {
        console.error("Error en getAllproductoMiel: ", err);
        res.status(500).send("Error en el servidor");
    }
};

exports.getAllproductoMiel = async (req, res) => {
    try {
        const productosMiel = await productoMiel.find()//.populate('ID_tipoProducto'); 
        res.status(200).send(productosMiel);
    } catch (err) {
        console.error("Error en getAllproductoMiel: ", err);
        res.status(500).send("Error en el servidor");
    }
};


// Obtener un producto de miel por su ID
exports.getproductoMielById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productoMiel.findById(id)//.populate('tipoProducto'); 
        if (producto) {
            res.status(200).send(producto);
        } else {
            res.status(404).send("No se encontró un registro con el Id enviado");
        }
    } catch (err) {
        console.error("Error en getproductoMielById: ", err);
        res.status(500).send("Error en el servidor");
    }
};


// Actualizar un producto de miel por su ID
exports.updateproductoMiel = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo, precio, fechaCaducidad, stock } = req.body;

        
        if (!nombre || !tipo || !precio) {
            return res.status(400).send("Faltan campos obligatorios");
        }

       

        
       

        const productoMielActualizado = {
            nombre,
            tipo,
           // cantidad,
            precio,
            //urlImagen,
            //descripcion,
            fechaCaducidad,
            stock,
           // ID_tipoProducto
        };

        const updatedProductoMiel = await productoMiel.findByIdAndUpdate(id, productoMielActualizado, { new: true });
        if (updatedProductoMiel) {
            res.status(200).send(updatedProductoMiel);
        } else {
            res.status(404).send("No se encontró un registro con el Id enviado");
        }
    } catch (err) {
        console.error("Error en updateproductoMiel: ", err);
        res.status(500).send("Error en el servidor");
       
    }
};

// Eliminar un producto de miel por su ID, solo admin
exports.deleteproductoMiel = async (req, res) => {
    try {
        const { id } = req.params;

        
        

        const deletedProductoMiel = await productoMiel.findByIdAndDelete(id);
        if (deletedProductoMiel) {
            res.status(200).send({ message: "Producto eliminado con éxito", deletedProductoMiel });
        } else {
            res.status(404).send("No se encontró un registro con el Id enviado");
        }
    } catch (err) {
        console.error("Error en deleteproductoMiel: ", err);
        res.status(500).send("Error en el servidor");
    }

  
   
    
};



exports.uploadFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si se subió un archivo
        if (!req.file) {
            return res.status(400).json({ message: "No se subió ningún archivo" });
        }

        // Verificar si el archivo es una imagen
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ message: "El archivo no es una imagen válida. Solo se permiten archivos PNG, JPG, JPEG, GIF, BMP." });
        }

        // Renombrar el archivo con el ID del producto
        const newFileName = `${id}${fileExtension}`;

        // Ruta del directorio de carga
        const uploadDir = path.join(__dirname, '..', 'uploads');
        const newFilePath = path.join(uploadDir, newFileName);

        // Verificar si el directorio existe; si no, crearlo
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Renombrar y mover el archivo
        fs.renameSync(req.file.path, newFilePath);

        // Detalles del archivo con el nuevo nombre
        const fileDetails = {
            Nombre_Archivo: newFileName,
            MimeType: req.file.mimetype,
            Size: req.file.size,
            Ruta: path.join('uploads', newFileName), // Ruta relativa
        };

        // Actualizar el producto con la nueva ruta de la imagen
        const updatedProducto = await productoMiel.findByIdAndUpdate(
            id,
            {
                urlImagen: fileDetails.Ruta,
                file: fileDetails,
            },
            { new: true }
        );

        // Validar si el producto fue encontrado y actualizado
        if (!updatedProducto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Responder con éxito
        res.status(200).json({
            message: "Archivo subido exitosamente",
            producto: updatedProducto,
        });
    } catch (err) {
        console.error("Error al subir el archivo:", err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};


exports.getUploadedFiles = async (req, res) => {
    try {
        // Recuperar todos los productos desde la base de datos
        const productos = await productoMiel.find();

        // Filtrar productos con archivos subidos
        const archivos = productos
            .filter((producto) => producto.file) // Productos que tienen un archivo asociado
            .map((producto) => ({
                id: producto._id,
                nombre: producto.Nombre_Producto,
                archivo: producto.file, // Detalles del archivo
            }));

        if (archivos.length === 0) {
            return res.status(404).send("No hay archivos subidos");
        }

        res.status(200).send({
            message: "Archivos subidos encontrados",
            archivos,
        });
    } catch (err) {
        console.error("Error al recuperar archivos: ", err);
        res.status(500).send("Error en el servidor");
    }
};


// Registrar el endpoint en Express





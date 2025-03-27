const express = require('express');
const app = express();
const path = require('path');

// Configurar la carpeta 'uploads' como ruta estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ejemplo de endpoint para paginación de productos (simulado)
app.get('/productoPaginacion', (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const productos = [
        { _id: '1', nombre: 'Miel Pura', tipo: 'Orgánica', precio: '$10', fechaCaducidad: '2024-12-31', stock: 15 },
        { _id: '2', nombre: 'Miel con Propóleo', tipo: 'Orgánica', precio: '$12', fechaCaducidad: '2024-12-31', stock: 10 },
        // Agrega más productos simulados según sea necesario
    ];
    res.json({
        productos: productos.slice((page - 1) * limit, page * limit),
        total: productos.length,
    });
});

// Configurar el servidor para escuchar en el puerto 3001
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const URL_CONNECT = process.env.URL_CONNECT;
const PORT = process.env.PORT;

const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/AuthRoutes');
const tipoProductoRoutes = require('./routes/TipoProductoRoutes');
const cors = require('cors');
const path = require('path');

// Conexión a MongoDB
mongoose.connect(URL_CONNECT)
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.log('Error conectando a MongoDB:', err));

const app = express();

app.use(cors({
    origin: ['proyectnube25-production-e6e4.up.railway.app', 'http://localhost:3001'], // Añade todos los orígenes necesarios
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(express.static(path.join(__dirname, '../Frontend/paginas')));
app.use("/uploads", express.static("uploads"));

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tipos', tipoProductoRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/paginas/index.html'));
});

// Ruta para otros HTML
app.get('/:page', (req, res) => {
    res.sendFile(path.join(__dirname, `../Frontend/paginas/${req.params.page}.html`));
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto: ${PORT}`);
});
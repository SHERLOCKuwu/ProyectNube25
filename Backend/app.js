const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config()

const URL_CONNECT = process.env.URL_CONNECT;
const PORT = process.env.PORT;

const productoRoutes = require('./routes/productoRoutes');
const cors = require('cors');

const multer = require('multer');
const path = require('path');

const AuthRoutes = require('./routes/AuthRoutes');
const tipoProductoRoutes = require('./routes/TipoProductoRoutes');


// Configurar almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Cambia 'uploads/' por tu ruta de destino
    },
    filename: (req, file, cb) => {
        const productId = req.body.id; // Obtén el ID del producto
        cb(null, productId + '.png'); // Guarda la imagen con el nombre 'id.png'
    }
});

const upload = multer({storage});


//Realizar la conexión a la base de datos
mongoose.connect(URL_CONNECT)
.then(()=>{
    console.log('Conectado a MongoDB');
})
.catch((err) =>{
    console.log('Error conectando a MongoDB: '+ err);
})

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));//NEW
app.use(express.static(path.join(__dirname, '../Frontend/paginas')));//NEW
productoRoutes(app);

// Endpoint para subir la imagen
app.post('/productoMiel/:id/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    res.status(200).json({
        message: 'Archivo subido exitosamente',
        Nombre_Archivo: req.file.filename,
        Ruta: req.file.path
    });
});

// Ruta principal que sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/paginas/index.html'));
});
// Ruta para servir otros HTML directamente
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `../Frontend/paginas/${page}.html`));
});

AuthRoutes(app);
tipoProductoRoutes(app);

app.use("/uploads", express.static("uploads"));

app.use(cors({ 
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.listen(PORT, ()=>{
    console.log(`El servidor está funcionando en el puerto: ${PORT}`);
});
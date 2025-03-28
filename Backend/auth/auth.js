const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY;

exports.signUp = async (req, res) => {
    try {
        const pEmail = req.body.email;
        const pPassword = req.body.password;
        const pRole = req.body.role || 'user'; // Si no se proporciona un rol, se asigna 'user'

        if (!pEmail) {
            res.status(400).send("El email es requerido");
            return;
        }
        if (!pPassword) {
            res.status(400).send("El password es requerido");
            return;
        }

        // Expresiones Regulares        
        let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(pEmail)) {
            res.status(400).send("El email no es válido");
            return;
        }

        const UserVerify = await User.findOne({ email: pEmail });
        if (UserVerify) {
            res.status(400).send("El Email ya está registrado en la plataforma");
            return;
        }

        const user = new User({
            email: pEmail,
            password: pPassword,
            role: pRole // Aquí asignamos el rol
        });

        const savedUser = await user.save();

        const payload = { id: savedUser.id, email: savedUser.email, role: savedUser.role }; // Incluimos el rol en el payload
        const token = jwt.sign(payload, SECRET_KEY);
        res.status(200).json({ savedUser, token });

    } catch (err) {
        console.log('Error en signUp: ' + err);
        res.status(500).send('Hubo un error en Sign Up');
    }
};


exports.login = async (req, res) => {
    try {
        const pEmail = req.body.email;
        const pPassword = req.body.password;

        const user = await User.findOne({ email: pEmail });

        if (!user) {
            res.status(401).send('Email o contraseña incorrecta');
            return;
        }

        const isMatch = await bcrypt.compare(pPassword, user.password);
        if (!isMatch) {
            res.status(401).send('Email o contraseña incorrecta');
            return;
        }

        const payload = { id: user.id, email: user.email, role: user.role }; // Incluimos el rol en el payload
        const token = jwt.sign(payload, SECRET_KEY);
        res.status(200).json({ user, token });

    } catch (err) {
        console.log('Error en login: ' + err);
        res.status(500).send('Hubo un error en login');
    }
};


//Middleware 

exports.authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send("Acceso denegado. Requiere rol de administrador.");
    }
    next();
};


exports.aunthenticate = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send('Falta el token de Autenticación');
        return;
    }

    const[type, token] = authHeader.split(' ');

    if(type !== "Bearer"){
        res.status(401).send('Tipo de Token no es válido');
        return;
    }

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded);
        req.user = decoded;
        next();
    }catch{
        res.status(401).send('Token Invalido');
        return;
    }
}



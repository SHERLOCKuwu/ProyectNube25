const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');

// Ruta de registro
router.post("/signup", auth.signUp);

// Ruta de login
router.post("/login", auth.login);

module.exports = router;
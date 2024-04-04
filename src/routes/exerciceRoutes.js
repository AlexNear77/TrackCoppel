// routes/exerciceRoutes.js

const express = require('express');
const router = express.Router();
const exerciceController = require('../controllers/exerciceController');

// Definir la ruta para el endpoint
router.post('/exercice', exerciceController);

module.exports = router;
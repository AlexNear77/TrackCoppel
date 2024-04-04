// routes/chatGPTRoutes.js
const express = require('express');
const router = express.Router();
const chatGPT = require('../controllers/chatGPTController');

// Define la ruta POST para el ejercicio y usa el controlador
router.post('/chat', chatGPT);

module.exports = router;
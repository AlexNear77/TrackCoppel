// server.js
require('dotenv').config();
const cors = require('cors');
const express = require('express'); // Asegúrate de requerir express aquí si no lo haces en app.js
const app = require('./src/app');
const sequelize = require('./src/database/db');

// Configura CORS para aceptar solicitudes desde tu aplicación React
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

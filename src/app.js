// app.js
const express = require('express');
const app = express();
// Accede a la variable de entorno FRONT_END
const frontEndUrl = process.env.FRONT_END;
// Aquí aplicas CORS directamente en la instancia de app que estás exportando
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:3000', frontEndUrl,  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware para parsear el cuerpo de las solicitudes a JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes con tipo de contenido application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Define tus rutas aquí
app.get('/', (req, res) => {
  res.send('CORS está configurado correctamente');
});

// Routes
const whatsappRoutes = require('./routes/whatsappRoutes');

const tokenRoutes = require('./routes/tokenRoutes');
const exerciceRoutes = require('./routes/exerciceRoutes');
const chatGPTRoutes = require('./routes/chatGroupRoutes');


// Aquí activas las rutas que habías comentado previamente
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api', tokenRoutes);
app.use('/api', exerciceRoutes);
app.use('/api', chatGPTRoutes);


module.exports = app;

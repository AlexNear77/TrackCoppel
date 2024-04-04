// routes/whatsappRoutes.js
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const axios = require('axios');
const shortUrl = require('short-url');

// Cargar las credenciales de Twilio de las variables de entorno
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Crear un cliente de Twilio usando las credenciales
const client = twilio(accountSid, authToken);

// Middleware para validar las solicitudes de Twilio
const twilioMiddleware = twilio.webhook({ validate: false });

let conversationStates = {};


router.post('/messages', twilioMiddleware, async (req, res) => {
    console.log('Cuerpo de la solicitud recibida:', req.body);

    // Verificar si es una notificación de estado y no un mensaje entrante
    if ('MessageStatus' in req.body) {
        console.log('Notificación de estado recibida:', req.body.MessageStatus);
        return res.status(200).send('Notificación de estado recibida y procesada.');
    }

    if (!req.body || !req.body.Body || !req.body.From) {
        console.error('La solicitud no tiene el cuerpo o los campos necesarios.');
        return res.status(400).send('Bad Request: No se encontró el cuerpo de la solicitud o los campos necesarios.');
    }

    const fromNumber = req.body.From;
    const userMessage = req.body.Body.trim();
    const twiml = new twilio.twiml.MessagingResponse();

    if (userMessage.toLowerCase() === 'hola') {
        conversationStates[fromNumber] = { step: 0 }; // Reiniciar el estado
        twiml.message('Hola, bienvenido a COPPEL! ¿Qué te gustaría hacer?\n1. Agregar producto\n2. Actualizar Inventario\n3. Ver Inventario');
    } else if (conversationStates[fromNumber] && conversationStates[fromNumber].step === 1) {
        conversationStates[fromNumber].email = userMessage;
        conversationStates[fromNumber].step = 2;
        twiml.message('Gracias, ahora por favor ingresa el token de tu compra:');
    } else if (conversationStates[fromNumber] && conversationStates[fromNumber].step === 2) {
        const email = conversationStates[fromNumber].email;
        const token = userMessage;
        // Implementar lógica de validación y generación del enlace aquí...
        const link = `${process.env.FRONT_END}/#/auth/wallet`;
        twiml.message(`Gracias. Puedes acceder a tu wallet aquí: ${link}`);
        delete conversationStates[fromNumber]; // Limpiar el estado
    }else if (userMessage === '1') {
        conversationStates[fromNumber] = { step: 'askOrigin' }; // Establecer el paso inicial para la opción 1
        twiml.message('¿Cuál es tu origen?');
    } else if (conversationStates[fromNumber] && conversationStates[fromNumber].step === 'askOrigin') {
        conversationStates[fromNumber].origin = userMessage; // Guardar el origen proporcionado por el usuario
        conversationStates[fromNumber].step = 'askDestination'; // Actualizar el paso a pedir destino
        twiml.message('¿Cuál es tu destino?');
    } else if (conversationStates[fromNumber] && conversationStates[fromNumber].step === 'askDestination') {
        conversationStates[fromNumber].destination = userMessage; // Guardar el destino proporcionado por el usuario
        conversationStates[fromNumber].step = 'selectSeat'; // Actualizar el paso a seleccionar asiento
        const frontEndLink = `${process.env.FRONT_END}/purity-ui-dashboard#/admin/form`; // Usar variable de entorno para el enlace
        twiml.message(`Solo selecciona tu asiento para poder terminar la compra, realizado en el siguiente sitio web: ${frontEndLink}`);
    } else 
    {
        switch (userMessage) {
            case '1':
                twiml.message('Comprar Viaje');
                break;
            case '2':
                conversationStates[fromNumber] = { step: 1 };
                twiml.message('Por favor, ingresa tu correo electrónico:');
                break;
            case '3':
                twiml.message('Ver estado de mi viaje');
                break;
            default:
                twiml.message('has elejido ver viaje');
                break;
        }
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

router.post('/send-sms', async (req, res) => {
    const { to, body } = req.body;

    // Verificar que se hayan proporcionado los campos necesarios
    if (!to || !body) {
        return res.status(400).send('Bad Request: Se requieren los campos "to" y "body".');
    }

    try {
        // Utilizar el cliente de Twilio para enviar un SMS
        const message = await client.messages.create({
            to: to, // Número de teléfono al que se enviará el SMS
            from: process.env.TWILIO_PHONE_NUMBER, // Tu número de teléfono de Twilio para enviar SMS
            body: body, // El cuerpo del mensaje SMS
        });

        // Responder con el mensaje de éxito y los detalles del mensaje enviado
        res.status(200).send({ 
            success: true, 
            message: 'Mensaje enviado correctamente.', 
            messageDetails: message 
        });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).send({ 
            success: false, 
            message: 'Error al enviar el mensaje.', 
            error: error.message 
        });
    }
});

module.exports = router;
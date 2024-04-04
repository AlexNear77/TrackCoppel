// controllers/chatGPTController.js
require('dotenv').config();

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Objeto para almacenar las conversaciones. Clave: identificador de sesión, Valor: array de mensajes
const conversations = {};

async function callOpenAI(sessionId, prompt) {
    // Recuperar o inicializar la conversación para esta sesión
    if (!conversations[sessionId]) {
        conversations[sessionId] = [{
            role: 'system',
            content: 'You are a business-focused assistant. You are knowledgeable about common business practices, negotiation strategies, and professional communication.'
        }];
    }

    // Agregar el último mensaje del usuario al historial de la conversación
    conversations[sessionId].push({
        role: 'user',
        content: prompt
    });

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: conversations[sessionId], // Usa el historial de conversación
            max_tokens: 150, // Ajusta el número de tokens si necesitas respuestas más largas
            temperature: 0.5,
            top_p: 1,
            stop: ['\n'], // Puede poner límites a la longitud de las respuestas
        });

        // Agregar la respuesta de GPT-4 al historial
        conversations[sessionId].push({
            role: 'assistant',
            content: completion.choices[0].message.content
        });

        // Por simplicidad, no maneja la limpieza de las conversaciones. En producción, considera mecanismos de expiración.
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error al llamar a la API de OpenAI:", error);
    }
}

async function businessChatController(req, res) {
    try {
        // Supone que 'sessionId' viene en la solicitud para identificar la conversación
        const sessionId = req.body.sessionId;
        const prompt = req.body.prompt;
        const response = await callOpenAI(sessionId, prompt);
        res.json({ response });
    } catch (error) {
        console.error("Error en el controlador de chat de negocios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = businessChatController;
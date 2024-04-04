const jwt = require('jsonwebtoken');

exports.getToken = (req, res) => {
    // La clave secreta debería ser más compleja y almacenada de manera segura para producción
    const secretKey = 'tuClaveSecreta';
    const options = { expiresIn: '1h' }; // El token expira en 1 hora
    const payload = { data: 'dataGenerica' }; // Payload del token

    const token = jwt.sign(payload, secretKey, options);

    res.json({ token });
};
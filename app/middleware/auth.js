const jwt = require('jsonwebtoken');
const config = require('../config/auth.config'); // Ajusta la ruta según sea necesario

verifyToken = (req, res, next) => {
    // Obtener el token de las cookies
    const token = req.cookies.token; // Cambia 'token' por el nombre que le diste a tu cookie

    if (!token) {
        return res.status(403).send({ message: 'No se proporcionó token!' });
    }

    // Verificar el token
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'No autorizado!' });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = { verifyToken };
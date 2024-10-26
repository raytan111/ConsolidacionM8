const express = require('express');
const router = express.Router();
const bootcampController = require('../controllers/bootcamp.controller');
const { auth } = require('../middleware/index'); // Importar solo el middleware de autenticación

// Rutas para bootcamps
router.post('/', auth.verifyToken, bootcampController.createBootcamp); // Verificar token
router.post('/adduser', auth.verifyToken, bootcampController.addUser); // Verificar token
router.get('/:id', auth.verifyToken, bootcampController.findById); // Verificar token
router.get('/', auth.verifyToken, bootcampController.findAll); // Verificar token

module.exports = router;
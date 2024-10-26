const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth, verifySignUp } = require('../middleware/index');

// Rutas para usuarios
router.post('/signup', [verifySignUp.checkDuplicateEmail], userController.createUser); // Crear un nuevo usuario
router.post('/signin', userController.login); // Iniciar sesión
router.get('/:id', auth.verifyToken, userController.findUserById); // Obtener un usuario por ID
router.get('/', auth.verifyToken, userController.findAll); // Obtener todos los usuarios
router.put('/:id', auth.verifyToken, userController.updateUserById); // Actualizar un usuario por ID
router.delete('/:id', auth.verifyToken, userController.deleteUserById); // Eliminar un usuario por ID

module.exports = router;
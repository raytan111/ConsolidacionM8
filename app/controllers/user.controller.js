const bcrypt = require('bcryptjs');
const db = require('../models'); // Importar los modelos
const User = db.users; // Obtener el modelo de usuarios
const Bootcamp = db.bootcamps; // Obtener el modelo de bootcamps
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config'); // Ajusta la ruta según sea necesario

// Crear y guardar un nuevo usuario
exports.createUser = async (req, res) => {
    try {
        const user = await User.create({
            ...req.body
        });

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña almacenada:', user.password);
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ accessToken: null, message: 'Contraseña inválida!',user });
        }

        // Generar un token
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 horas
        });

        // Configurar cookie
        res.cookie('token', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript del lado del cliente
            secure: false,  // Cambiar a true en producción si usas HTTPS
            maxAge: 86400000 // 24 horas
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            message: 'Inicio de sesión exitoso',token
        });
    } catch (error) {
        res.status(500).send({ message: 'Error al intentar iniciar sesión', error });
    }
};

// Obtener un usuario por ID
exports.findUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: Bootcamp,
            attributes: { exclude: ['password'] } // Excluir la contraseña
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

// Obtener todos los usuarios
exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            include: Bootcamp,
            attributes: { exclude: ['password'] } // Excluir la contraseña
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

// Actualizar un usuario por ID
exports.updateUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si se envía una nueva contraseña, encriptarla antes de actualizar
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.update(req.body);

        // Excluir el campo de contraseña en la respuesta
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

// Eliminar un usuario por ID
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await user.destroy();
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};
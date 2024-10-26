const db = require('../models'); // Importar los modelos
const Bootcamp = db.bootcamps; // Obtener el modelo de bootcamps
const User = db.users; // Obtener el modelo de usuarios

// Crear y guardar un nuevo Bootcamp
exports.createBootcamp = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json(bootcamp);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el bootcamp', error });
    }
};

// Agregar un usuario al bootcamp
exports.addUser = async (req, res) => {
    try {
        // Obtener los IDs del cuerpo de la solicitud
        const { idBootcamp, idUser } = req.body;

        const bootcamp = await Bootcamp.findByPk(idBootcamp);
        const user = await User.findByPk(idUser);

        if (!bootcamp || !user) {
            return res.status(404).json({ message: 'Bootcamp o usuario no encontrado' });
        }

        await bootcamp.addUser(user);
        res.json({ message: 'Usuario agregado al bootcamp' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el usuario al bootcamp', error });
    }
};

// Obtener un bootcamp por ID
exports.findById = async (req, res) => {
    try {
        const bootcamp = await Bootcamp.findByPk(req.params.id, {
            include: User // Incluir usuarios en la consulta
        });
        if (!bootcamp) {
            return res.status(404).json({ message: 'Bootcamp no encontrado' });
        }
        res.json(bootcamp);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el bootcamp', error });
    }
};

// Obtener todos los bootcamps
exports.findAll = async (req, res) => {
    try {
        const bootcamps = await Bootcamp.findAll({ include: User });
        res.json(bootcamps);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los bootcamps', error });
    }
};
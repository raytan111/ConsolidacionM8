const express = require('express');
const cookieParser = require('cookie-parser'); // Importar cookie-parser
const db = require('./app/models'); // Importar modelos y base de datos
const userRoutes = require('./app/routes/user.routes'); // Importar rutas de usuarios
const bootcampRoutes = require('./app/routes/bootcamp.routes'); // Importar rutas de bootcamps
const userController = require('./app/controllers/user.controller'); // Ajusta la ruta según tu estructura de carpetas
const bootcampController = require('./app/controllers/bootcamp.controller'); // Lo mismo aquí

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(cookieParser()); // Usar el middleware de cookie-parser

// Usar rutas de usuarios y bootcamps
app.use('/api/user', userRoutes); // Prefijo para todas las rutas de usuarios
app.use('/api/bootcamp', bootcampRoutes); // Prefijo para todas las rutas de bootcamps

// Función para crear usuarios
const createUsers = async () => {
    try {
        const users = [
            { firstName: 'Mateo', lastName: 'Díaz', email: 'mateo.diaz@correo.com', password: 'password123' },
            { firstName: 'Santiago', lastName: 'Mejías', email: 'santiago.mejias@correo.com', password: 'password123' },
            { firstName: 'Lucas', lastName: 'Rojas', email: 'lucas.rojas@correo.com', password: 'password123' },
            { firstName: 'Facundo', lastName: 'Fernandez', email: 'facundo.fernandez@correo.com', password: 'password123' },
        ];

        for (const user of users) {
            await userController.createUser(
                { body: user },
                { status: (code) => ({ json: (data) => console.log(data) }) }
            );
        }
    } catch (error) {
        console.error('Error al crear los usuarios:', error);
    }
};

// Función para crear bootcamps
const createBootcamps = async () => {
    try {
        const bootcamps = [
            { title: 'Introduciendo El Bootcamp De React.', cue: 10, description: 'React es la librería más usada en JavaScript para el desarrollo de interfaces.' },
            { title: 'Bootcamp Desarrollo Web Full Stack.', cue: 12, description: 'Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares, como: JavaScript, nodeJS, Angular, MongoDB, ExpressJS.' },
            { title: 'Bootcamp Big Data, Inteligencia Artificial & Machine Learning.', cue: 18, description: 'Domina Data Science, y todo el ecosistema de lenguajes y herramientas de Big Data, e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning.' },
        ];

        for (const bootcamp of bootcamps) {
            await bootcampController.createBootcamp(
                { body: bootcamp },
                { status: (code) => ({ json: (data) => console.log(data) }) }
            );
        }
    } catch (error) {
        console.error('Error al crear los bootcamps:', error);
    }
};

// Nuevas consultas
const runQueries = async () => {
    try {
        // Consultar el Bootcamp por id
        const bootcampId = 1;
        await bootcampController.findById(
            { params: { id: bootcampId } },
            { json: (data) => console.log("-----------Bootcamp consultado:-------------------------", data) }
        );

        // Listar todos los Bootcamps
        await bootcampController.findAll({}, { json: (data) => console.log("--------------Todos los Bootcamps:----------------------", data) });

        // Consultar un usuario por id
        const userId = 1;
        await userController.findUserById(
            { params: { id: userId } },
            { json: (data) => console.log("-------------Usuario consultado:-----------------------", data) }
        );

        // Listar todos los usuarios
        await userController.findAll({}, { json: (data) => console.log("-------------Todos los usuarios:----------------------", data) });

        // Actualizar el usuario según su id
        const userIdToUpdate = 1;
        await userController.updateUserById(
            { params: { id: userIdToUpdate }, body: { firstName: "Pedro", lastName: "Sánchez" } },
            { json: (data) => console.log("-----------Usuario actualizado:-----------------------", data) }
        );

        // Eliminar un usuario por id
        const userIdToDelete = 1;
        await userController.deleteUserById(
            { params: { id: userIdToDelete } },
            { json: (data) => console.log(`-----------Usuario con id ${userIdToDelete} eliminado.---------------------------`) }
        );

    } catch (error) {
        console.error('Error en las consultas:', error);
    }
};

// Sincronizar la base de datos y ejecutar la creación de usuarios y bootcamps
db.sequelize.sync({ force: true })  // `force: true` elimina y vuelve a crear las tablas
    .then(async () => {
        console.log('Base de datos sincronizada');
        await createUsers();    // Crear usuarios
        await createBootcamps(); // Crear bootcamps
        await runQueries();      // Ejecutar consultas
    })
    .catch((error) => console.error('Error al sincronizar la base de datos:', error));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
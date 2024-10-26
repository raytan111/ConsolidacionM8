module.exports = {
    HOST: 'localhost',
    USER: 'postgres',
    PASSWORD: '1234', // Cambia esta contraseña si es diferente
    DB: 'db_node',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
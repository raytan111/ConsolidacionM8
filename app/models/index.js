const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.acquire,
        idle: dbConfig.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.users = require('./user.model')(sequelize, Sequelize);
db.bootcamps = require('./bootcamp.model')(sequelize, Sequelize);
db.userBootcamp = require('./user_bootcamp.model')(sequelize, Sequelize);

// Asociación muchos a muchos entre users y bootcamps
db.users.belongsToMany(db.bootcamps, { 
    through: db.userBootcamp, 
    foreignKey: 'user_id' 
});
db.bootcamps.belongsToMany(db.users, { 
    through: db.userBootcamp, 
    foreignKey: 'bootcamp_id' 
});

module.exports = db;
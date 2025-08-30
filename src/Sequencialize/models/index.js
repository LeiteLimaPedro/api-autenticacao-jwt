const { sequelize } = require('../../Persistence/Database');
const buildUser = require('./UserModel');

const db = {};
db.sequelize = sequelize;

// Inicializa cada model e guarda no objeto db
db.User = buildUser(sequelize);

// Se houver associações, você configura aqui (db.User.hasMany(...), etc.)

module.exports = db;
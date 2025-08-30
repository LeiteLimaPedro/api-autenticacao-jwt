const { Sequelize } = require('sequelize');
const dbConfig = require('../config/config'); // <-- só o bloco do DB
let sequelize;

function createConnection() {
  if (!sequelize) {
    sequelize = new Sequelize(
      dbConfig.database,
      dbConfig.username,
      dbConfig.password,
      {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        define: dbConfig.define
      }
    );
  }
  return sequelize;
}

async function testConnection() {
  try {
    await createConnection().authenticate();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
  }
}

module.exports = {
  sequelize: createConnection(),
  testConnection
};
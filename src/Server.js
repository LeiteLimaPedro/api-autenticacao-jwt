const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/AuthRoutes');
const protectedRoutes = require('./Routes/ProtectedRoutes');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const { sequelize } = require('./Persistence/Database');
const swaggerDoc = yaml.load('swagger.yml');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const PORT = process.env.PORT || 3000;

// Testa conexão e sobe o servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado ao PostgreSQL');
    return sequelize.sync(); // garante que a tabela users existe
  })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no banco:', err);
  });
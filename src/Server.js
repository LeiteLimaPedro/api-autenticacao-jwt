const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/AuthRoutes');
const protectedRoutes = require('./Routes/ProtectedRoutes');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDoc = yaml.load('swagger.yml');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const authenticate = require('./middlewares/authenticate');

const app = express();

app.use(express.json());

// 请求日志：把morgan的输出接到logger里
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.get('/', (req, res) => {
  res.send('Qazaq Dual Reader backend 运行中 🚀');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
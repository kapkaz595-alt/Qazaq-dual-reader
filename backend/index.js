require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// 请求日志：把morgan的输出接到logger里
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.get('/', (req, res) => {
  res.send('Qazaq Dual Reader backend 运行中 🚀');
});

app.listen(PORT, () => {
  logger.info(`服务器已启动，监听端口 ${PORT}`);
});
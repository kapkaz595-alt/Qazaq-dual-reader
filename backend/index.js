const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`服务器已启动，监听端口 ${PORT}`);
});
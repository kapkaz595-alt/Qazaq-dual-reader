const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // 记录完整错误信息到日志（含堆栈），方便开发排查
  logger.error(`${err.message}\n${err.stack}`);

  // 返回给客户端的标准错误结构，不暴露堆栈信息
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || '服务器内部错误',
      code: statusCode
    }
  });
}

module.exports = errorHandler;
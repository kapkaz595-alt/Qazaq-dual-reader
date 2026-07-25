const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Qazaq Dual Reader API',
      version: '1.0.0',
      description: '哈萨克双文字阅读平台 后端API文档',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
  },
  // 以后每个路由文件里写好注释,这里指定去哪些文件扫描注释
  apis: ['./routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
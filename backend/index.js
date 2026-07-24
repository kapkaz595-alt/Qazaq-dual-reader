require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Qazaq Dual Reader backend 运行中 🚀');
});

app.listen(PORT, () => {
  console.log(`服务器已启动，监听端口 ${PORT}`);
});
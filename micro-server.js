// micro-server.js
const ip = require("ip");
const express = require("express");

const app = express();
const host = ip.address();

// 所有托管的微应用都放在 public 目录下
// 通过 http://${host}:3000/iframe-app.html 可以访问 public/iframe-app.html
app.use(express.static(__dirname + "/public"));

// 启动 Node 服务
app.listen(3000, host);
console.log(`server start at http://${host}:3000/`);
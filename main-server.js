// main-server.js
const path = require('path');
// https://github.com/indutny/node-ip
const ip = require("ip");
// https://github.com/expressjs/express
const express = require("express");

const app = express();
// 获取本机的 IP 地址
const host = ip.address();

// ejs 中文网站: https://ejs.bootcss.com/#promo
// ejs express 示例: https://github.com/expressjs/express/blob/master/examples/ejs/index.js
app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// 浏览器访问 http://${host}:4000/ 时会渲染 views/main.html 
app.get("/", function (req, res) {
  // 使用 ejs 模版引擎填充主应用 views/main.html 中的 host 变量，并将其渲染到浏览器
  res.render("main", {
    host
  });
});

// 启动 Node 服务
app.listen(4000, host);
console.log(`server start at http://${host}:4000/`);
const path = require('path');
// https://github.com/indutny/node-ip
const ip = require("ip");
// https://github.com/expressjs/express
const express = require("express");

const app = express();
// 获取本机的 IP 地址
const host = ip.address();
console.log("host: ", host);

// ejs 中文网站: https://ejs.bootcss.com/#promo
// ejs express 示例: https://github.com/expressjs/express/blob/master/examples/ejs/index.js
app.engine(".html", require("ejs").__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// 所有托管的静态资源都放在 public 目录下
// 通过 http://${host}:4444/micro-app1.html 可以访问 public/micro-app1.html
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  // 使用 ejs 模版引擎填充 views/main.html 中的 host 变量，并将其渲染到浏览器
  res.render("main", {
    host
  });
});

// 启动 Node 服务
app.listen(4444, host);
console.log(`server start at http://${host}:4444/`);

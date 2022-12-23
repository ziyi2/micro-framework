// same-site-different-port/main-server.js
import path from "path";
import express from "express";
import ejs from "ejs";
import config from "../config.js";
const { port, host, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// 浏览器访问 http://${host}:${port.main}/ 时会渲染 views/main.html
app.get("/", function (req, res) {
  // 设置主应用的 cookie 标识
  res.cookie("main-app", "true");
  // 使用 ejs 模版引擎填充主应用 views/main.html 中的 micro 变量，并将其渲染到浏览器
  res.render("main", {
    // micro 指向微应用的打开地址
    micro: `http://${host}:${port.micro}`,
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);

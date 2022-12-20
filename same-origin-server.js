// same-origin-server.js
import path from "path";
import express from "express";
import ejs from "ejs";

import config from "./config.js";
const { port, host, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  // 设置主应用的 cookie 标识
  res.cookie("main-app", "true");
  // 渲染 views/main.html 并填充模板中的 micro 变量
  res.render("main", {
    micro: `http://${host}:${port.main}/micro`,
  });
});

app.get("/micro", function (req, res) {
  // 设置 iframe 微应用的 cookie 标识，顺便观察能否覆盖主应用的 cookie 标识
  res.cookie("micro-app", "true").cookie("main-app", "false");
  // 渲染 views/micro.html
  res.render("micro");
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);

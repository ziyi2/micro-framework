// cross-site/micro-server.js
// 微应用服务代码
import path from "path";
import express from "express";
import ejs from "ejs";
import config from "../config.js";

const { host, port, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  // 增加 SameSite 和 Secure 属性
  const cookieOptions = { sameSite: "none", secure: true };
  res
    .cookie("micro-app", "true", cookieOptions)
    // 设置 iframe 微应用的 cookie 标识，顺便观察能否覆盖主应用的 cookie 标识
    .cookie("main-app", "false", cookieOptions);
  res.render("micro");
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

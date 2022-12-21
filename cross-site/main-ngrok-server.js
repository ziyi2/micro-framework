import path from "path";
import express from "express";
// https://github.com/bubenshchykov/ngrok
import ngrok from "ngrok";
import ejs from "ejs";

import config from "../config.js";
const { port, host, authtoken, __dirname } = config;
const app = express();

// 内网穿透（微应用反向代理）
const micro = await ngrok.connect({
  proto: "http",
  authtoken,
  addr: `http://${host}:${port.micro}`,
  // 更改为 https 协议
  bind_tls: true,
});

console.log("micro app ngrok url: ", micro);

// 内网穿透（主应用反向代理）
const main = await ngrok.connect({
  proto: "http",
  authtoken,
  addr: `http://${host}:${port.main}`,
  bind_tls: true,
});

console.log("main app ngrok url: ", main);

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  res.cookie("main-app", "true");
  res.render("main", {
    micro,
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);

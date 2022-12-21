// main-ngrok-server.js
import path from "path";
import express from "express";
// https://github.com/bubenshchykov/ngrok
import ngrok from "ngrok";
import ejs from "ejs";

import config from "../config.js";
const { port, host, authtoken, __dirname } = config;
const app = express();

// 内网穿透（主应用反向代理）
const main = await ngrok.connect({
  proto: "http",
  authtoken,
  addr: `http://${host}:${port.main}`,
  bind_tls: false,
});

console.log("main app ngrok url: ", main);

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");


// 主应用访问地址：http://xxx.ngrok.io
app.get("/", function (req, res) {
  res.cookie("main-app", "true");
  // 使子域的微应用可以共享 Cookie
  res.cookie("main-app-share", "true", { domain: main.replace("http://", "") });
  res.render("main", {
    // 微应用访问地址：http://ziyi.xxx.ngrok.io
    // 使用 iHosts 配置 ziyi.xxx.ngrok.io 指向本机的 ip 地址
    // 访问 http://ziyi.xxx.ngrok.io:${port} 时会指向 http://${host}:${port}
    micro: `http://ziyi.${main.replace("http://", "")}:${port.micro}`,
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);

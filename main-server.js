// main-server.js
import path from "path";
// https://github.com/expressjs/express
import express from "express";
// https://github.com/bubenshchykov/ngrok
import ngrok from "ngrok";
// ejs 中文网站: https://ejs.bootcss.com/#promo
// ejs express 示例: https://github.com/expressjs/express/blob/master/examples/ejs/index.js
import ejs from "ejs";
// https://github.com/expressjs/cookie-parser
import cookieParser from "cookie-parser";

import config from "./config.js";
const { port, host, authtoken, __dirname } = config;
const app = express();

app.use(cookieParser());

// 内网穿透
const micro = await ngrok.connect({
  proto: "http",
  authtoken,
  addr: `http://${host}:${port.micro}`,
  bind_tls: false,
});

console.log("micro app ngrok url: ", micro);

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

// 浏览器访问 http://${host}:${port.main}/ 时会渲染 views/main.html
app.get("/", function (req, res) {
  res.cookies &&
    Object.keys(res.cookies).forEach((name) =>
      res.cookie(name, res.cookies[name])
    );
  res.cookie("main-app", "true", { domain: main.replace('http://', '')});
  // 使用 ejs 模版引擎填充主应用 views/main.html 中的 host 变量，并将其渲染到浏览器
  res.render("main", {
    micro,
    micro2: `http://${host}:${port.micro}`,
    micro3: `http://ziyi.${main.replace('http://', '')}:3000`,
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);

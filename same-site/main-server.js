// same-site/main-server.js
// 主应用服务代码
import path from "path";
import express from "express";
import ejs from "ejs";

import config from "../config.js";
const { port, host, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

// 使用 iHosts 配置 example.com 指向本机的 ip 地址
// 主应用访问地址：http://example.com:4000
app.get("/", function (req, res) {
  res.cookie("main-app", "true");
  // 使子域的微应用可以共享 Cookie
  // 在设置 Cookie 时，可以使用 Domain和 Path 来标记作用域
  // 默认不指定的情况下，Domain 属性为当前应用的 host，由于 ziyi.example.com 和 example.com 不同
  // 因此默认情况下两者不能共享 Cookie，可以通过设置 Domain 使其为子域设置 Cookie，例如 Domain=example.com，则 Cookie 也包含在子域 ziyi.example.com 中
  res.cookie("main-app-share", "true", { domain: "example.com" });
  res.render("main", {
    // 使用 iHosts 配置 ziyi.example.com 指向本机的 ip 地址
    // 子应用访问地址： http://ziyi.example.com:3000
    micro: `http://ziyi.example.com:${port.micro}`,
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`main app start at http://${host}:${port.main}/`);

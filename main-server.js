// main-server.js
import express from "express";
import path from "path";
import morgan from "morgan";
import config from "./config.js";
import cookieParser from "cookie-parser";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

// cookie 中间件
app.use(cookieParser());

app.use(express.static(path.join("public", "main")));

app.post("/microapps", function (req, res) {

  console.log("main cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("main-app", true);

  // 这里可以是管理后台新增菜单后存储到数据库的数据
  // 从而可以通过管理后台动态配置微应用的菜单
  res.json([
    {
      name: "micro1",
      id: "micro1",
      // 自定义元素名称
      customElement: "micro-app-1",
      // 这里暂时以一个入口文件为示例
      script: `https://${host}:3001/micro1.js`,
      style: `https://${host}:3001/micro1.css`,
      prefetch: true,
    },
    {
      name: "micro2",
      id: "micro2",
      customElement: "micro-app-2",
      script: `https://${host}:3001/micro2.js`,
      style: `https://${host}:3001/micro2.css`,
      prefetch: true,
    },
  ]);
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);

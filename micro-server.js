// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();

const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

// 设置支持跨域请求头
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS");
  next();
});

app.use(
  express.static(path.join("public", "micro"))
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.main}/`);

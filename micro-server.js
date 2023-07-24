// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(
  express.static(path.join("public", "micro"), {
    cacheControl: false,
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      // 10 秒后强缓存失效
      res.set("Expires", new Date(Date.now() + 5 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

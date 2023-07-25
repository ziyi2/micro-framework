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
    // 禁用 cache-control，HTTP / 1.1 的缓存能力
    cacheControl: false,
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      // 5 秒后缓存失效，注意使用 GMT 格式时间
      res.set("Expires", new Date(Date.now() + 5 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

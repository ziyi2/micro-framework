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
    cacheControl: true,
    maxAge: 5000,
    etag: true,
    // 如果设置为 true，那么上述示例中访问拷贝的文件是返回 304 还是 200 呢？
    lastModified: false,
    setHeaders: (res) => {
      // 1 秒后缓存失效，注意使用 GMT 格式时间
      res.set("Expires", new Date(Date.now() + 1 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

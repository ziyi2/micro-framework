// micro-server.js
import express from "express";
import morgan from "morgan";
import path from 'path';
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(
  express.static(path.join("public", "micro"), {
    // 缓存技术有很多种，包括 CDN 缓存、DNS 缓存、Nginx 缓存、代理缓存、服务端缓存和浏览器缓存...
    // 浏览器缓存又有多种类型：HTTP 缓存、内存缓存、硬盘缓存、Prefetch 缓存、Service Worker 缓存、Push 缓存...
    // 这里设置的是浏览器缓存中的 HTTP 缓存
    // 设置静态资源的缓存，可以结合协商缓存
    // maxAge: 86400000, // 强缓存
    etag: true,
    lastModified: true,
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.main}/`);

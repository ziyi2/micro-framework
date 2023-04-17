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
  // 跨域请求中涉及到 Cookie 信息传递，值不能为 *，必须是具体的地址信息
  res.header('Access-Control-Allow-Origin', `http://${host}:${port.main}`);
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );
  res.header('Allow', 'GET, POST, OPTIONS');
  // 允许客户端发送跨域请求时携带 Cookie
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

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

app.post("/cors", function (req, res) {
  // 设置一个响应的 Cookie 数据
  res.cookie("micro-app", true);
  res.json({
    hello: "true",
  });
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

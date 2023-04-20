import express from "express";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import config from "./config.js";
const app = express();
const { port, host } = config;

app.use(morgan("dev"));

// cookie 中间件
app.use(cookieParser());

// 设置支持跨域请求头
app.use((req, res, next) => {
  // 跨域请求中涉及到 Cookie 信息传递，值不能为 *，必须是具体的地址信息
  res.header("Access-Control-Allow-Origin", `http://ziyi.com:${port.main}`);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS");
  // 允许跨域请求时携带 Cookie
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  express.static(path.join("public", "micro"), {
    etag: true,
    lastModified: true,
  })
);

app.post("/cors", function (req, res) {
  console.log("micro cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("micro-app", true);
  res.json({
    hello: "true",
  });
});

app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

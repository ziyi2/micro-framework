// micro-server.js
import path from "path";
import express from 'express';
import ejs from 'ejs';
import cookieParser from "cookie-parser";
import config from './config.js';

const { host, port, __dirname } = config;
const app = express();

app.use(cookieParser());

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  res.cookies &&
  Object.keys(res.cookies).forEach((name) =>
    res.cookie(name, res.cookies[name])
  );
  res.cookie("micro-app", "true");
  res.render("micro");
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);

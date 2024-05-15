// packages/react-app/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

let root;

import(/* webpackChunkName: "about" */ "./about.js").then((res) => {
  console.log(res);
});

if (!window.__POWERED_BY_QIANKUN__) {
  root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export async function bootstrap() {
  console.log("[React 子应用] bootstrap excuted");
}

export async function mount(props) {
  console.log("[React 子应用] mount excuted, props: ", props);
  // qiankun 在注册 react 子应用时会通过 props 传递 container
  // Creact React App 自带的 HTML 模版的挂载节点是 #root（可以查看 public/index.html）
  // 由于微应用的 HTML 内容会挂载在 container 上
  // 因此可以从 container 中获取到 #root 节点挂载 react 应用
  root = ReactDOM.createRoot(props.container.querySelector("#root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export async function unmount(props) {
  console.log("[React 子应用] unmount excuted, props: ", props);
  root && root.unmount();
}

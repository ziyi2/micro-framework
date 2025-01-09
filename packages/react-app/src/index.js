// packages/react-app/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

let root;

if (!window.__POWERED_BY_FRAMEWORK__) {
  root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export async function bootstrap() {
  // console.log("[React 子应用] bootstrap excuted");
}

export async function mount(props) {
  // 下一次进入时，查看 window.micro 的值
  console.log(
    "[React 微应用] mount 开始时读取 window.micro 值：",
    window.micro
  );

  // 变更 window 属性
  window.micro = "micro-react";
  console.log("[React 微应用]", "设置 micro 的值为 micro-react。");

  // micro-framework 在注册 react 子应用时会通过 props 传递 container
  // Creact React App 自带的 HTML 模版的挂载节点是 #root（可以查看 public/index.html）
  // 因此可以从 container 中获取到 #root 节点挂载 react 应用
  root = ReactDOM.createRoot(props.container.querySelector("#root"));
  root.render(<App />);
}

export async function unmount() {
  // console.log("[React 子应用] unmount excuted, props: ", props);
  root && root.unmount();
}

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

export async function bootstrap() {}

export async function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    // 不接收自己发送的消息
    if (state.origin === "react-app") return;
    console.log("[React 子应用] 监听触发：", state);
  });
  // 如果希望子应用在挂载时发送消息给主应用，可以在 mount 方法中调用 setGlobalState 方法
  // props.setGlobalState({
  //   message:
  //     "这是一条 React 子应用发送的消息，React 子应用的 mount 方法被调用。",
  //   origin: "react-app",
  // });

  root = ReactDOM.createRoot(props.container.querySelector("#root"));
  root.render(<App />);
}

export async function unmount() {
  root && root.unmount();
}

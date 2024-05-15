import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';

let root;

import(/* webpackChunkName: "about" */ "./about.js").then((res) => {
  console.log(res);
});

// 判断是否在 qiankun 的环境中运行
// 如果不是，那么说明不在微前端的环境中，可以独立启动
if (!window.__POWERED_BY_QIANKUN__) {
  root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

/**
 * bootstrap 只会在微应用首次激活时调用一次
 * 微应用重新激活时会直接调用 mount 周期函数，不会再重复触发 bootstrap。
 * 通常情况下这里不需要进行任何处理，初始化的代码可以放在当前入口文件的顶层处理
 * 除非会执行微应用的 unload 动作，然后需要再次执行 bootstrap，可能需要在此做一些必要的初始化动作
 * 注意这里的周期函数不是 async 函数，在主应用中引入该周期函数后需要进行 async 处理
 */

// 注意这里的每一个生命周期函数必须是 async 函数
export async function bootstrap() {
  console.log("[React 子应用] bootstrap excuted");
}

/**
 * 微应用每次激活时都会调用 mount 周期函数，通常在这里执行微应用的渲染
 */
export async function mount(props) {
  console.log("[React 子应用] mount excuted, props: ", props);
  // qiankun 在注册 react 子应用时会通过 props 传递 microContainer 微应用 DOM 容器元素 ID
  root = ReactDOM.createRoot(document.getElementById(props.microContainer));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

/**
 * 微应用每次失活时会调用 unmount 周期函数，通常在这里执行微应用的卸载
 */
export async function unmount(props) {
  console.log("[React 子应用] unmount excuted, props: ", props);
  root && root.unmount();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

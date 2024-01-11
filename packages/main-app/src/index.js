import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { registerMicroApps } from "./utils/single-spa.ts";
import {
  MICRO_APP_CONTAINER_ID,
  MICRO_APP_ROUTER,
  mockMicroApps,
} from "./utils/micros";

// 对 single-spa 的注册 API 进行了二次封装，支持传入数组进行批量注册
registerMicroApps(
  // 根据后端提供的动态数据批量注册微应用
  mockMicroApps.map((item) => ({
    name: item.name,
    app: () => {
      // import 无法使用变量，所以这里需要使用 if/else 判断进行硬编码
      if (item.router === MICRO_APP_ROUTER.REACT) {
        // 按需动态加载微应用的 NPM 包（Webpack 会进行 chunk 分离）

        // 注意 app 参数需要返回的是 Promise 对象
        // 这里可以重点再回顾一下注册微应用 API 的参数声明
        // 1、app 本身如果是函数，那么必须是 async 函数（需要返回 Promise 对象）
        // 2、Promise.resolve 需要返回生命周期函数对象，每一个生命周期函数也必须是 async 函数
        return import("react-micro-app");
      } else if (item.router === MICRO_APP_ROUTER.VUE) {
        return import("vue-micro-app");
      }
    },
    activeWhen: item.router,
    customProps: {
      // 向微应用传递需要挂载的容器元素 ID
      container: MICRO_APP_CONTAINER_ID,
    },
  }))
);

const router = createBrowserRouter([
  {
    path: "/",
    // <App /> 中提供了左侧导航栏和右侧内容区域的布局结构
    element: <App />,
    // children 中的元素会被渲染到 <App /> 的 <Outlet /> 中
    // <Outlet> 是 react-router-dom 提供的一个组件，用于渲染子路由：https://reactrouter.com/en/main/components/outlet

    // 遍历迭代 mockMicroApps 中的数据，生成对应的路由配置
    // 这里的路由配置和微应用注册 API 中的 activeWhen 一致
    children: mockMicroApps.map((item) => ({
      path: item.router,
      // 微应用的容器元素，用于渲染微应用
      element: <div id={MICRO_APP_CONTAINER_ID}></div>,
    })),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

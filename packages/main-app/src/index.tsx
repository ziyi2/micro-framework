// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// single-spa 注册和启动
// import { registerMicroApps, fetchApp } from "./utils/single-spa.ts";
// qiankun 注册和启动
import { registerQiankunMicroApps } from "./utils/qiankun";
import { MICRO_APP_CONTAINER_ID, mockMicroApps } from "./utils/micros";

// // single-spa 的使用方式
// // 对 single-spa 的注册 API 进行了二次封装，支持传入数组进行批量注册
// registerMicroApps(
//   // 根据后端提供的动态数据批量注册微应用
//   mockMicroApps.map((item) => ({
//     name: item.name,
//     app: () => {
//       // 通过 Fetch 请求方式获取
//       return fetchApp(item.entry);
//     },
//     activeWhen: item.activeWhen,
//     customProps: item.customProps,
//   }))
// );

// qiankun 的使用方式
// 不需要像 single-spa 设计 app 参数，手动实现微应用资源的加载、执行并识别出生命周期函数
// 不需要设计 fetchApp 手动加载逻辑，qiankun 内部会自动请求和执行微应用的脚本，并制动识别出微应用的生命周期函数
registerQiankunMicroApps(mockMicroApps);

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
      path: item.activeRule,
      // 微应用的容器元素，用于渲染微应用
      // 在 qiankun 的注册中提供的 container 参数配置
      element: <div id={MICRO_APP_CONTAINER_ID}></div>,
    })),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

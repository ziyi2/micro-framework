import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { registerMicroApps, fetchApp } from "./utils/single-spa.ts";
import { MICRO_APP_CONTAINER_ID, mockMicroApps } from "./utils/micros.ts";

// 对 single-spa 的注册 API 进行了二次封装，支持传入数组进行批量注册
registerMicroApps(
  // 根据后端提供的动态数据批量注册微应用
  mockMicroApps.map((item) => ({
    name: item.name,
    app: () => {
      // 通过 Fetch 请求方式获取
      return fetchApp(item.entry);
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

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

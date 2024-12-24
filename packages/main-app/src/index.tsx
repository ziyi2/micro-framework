// src/index.tsx
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// 自制框架 frameworkd 的注册和启动
import { registerFrameworkMicroApps } from "./utils/framework";
import { mockMicroApps } from "./utils/micros";

registerFrameworkMicroApps(mockMicroApps);

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
      path: item.activeWhen,
      // 微应用的容器元素，用于渲染微应用
      // 在 framework 的注册中提供的 container 参数配置
      element: <div id={item.container?.replace("#", "")}></div>,
    })),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

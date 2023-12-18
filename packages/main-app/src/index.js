import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getAppLifeCycles, registerMicroApps } from "./utils/single-spa.ts";
import {
  MICRO_APP_CONTAINER_ID,
  MICRO_APP_ROUTER,
  mockMicroApps,
} from "./utils/micros";

// 根据后端提供的动态数据注册微应用
registerMicroApps(
  mockMicroApps.map((item) => ({
    name: item.name,
    app: () => {
      // import 无法使用变量，所以这里需要使用 if/else 判断
      if (item.router === MICRO_APP_ROUTER.REACT) {
        return import("react-micro-app").then((res) => getAppLifeCycles(res));
      } else if (item.router === MICRO_APP_ROUTER.VUE) {
        return import("vue-micro-app").then((res) => getAppLifeCycles(res));
      }
    },
    activeWhen: item.router,
    customProps: {
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

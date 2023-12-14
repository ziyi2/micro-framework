import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getAppLifeCycles, registerMicroApps } from "./utils/single-spa.ts";
import { MICRO_APP_CONTAINER_ID, MICRO_APP_ROUTER } from "./utils/micros";

// single-spa 提供了两种调用方式：registerApplication({ name, app, activeWhen, customProps }) 和 registerApplication(name, app, activeWhen, customProps)
// 详见 https://single-spa.js.org/docs/configuration#registering-applications
registerMicroApps([
  {
    name: "react",
    // app 参数可以是一个对象，也可以是一个函数

    // 如果 app 参数是对象，那么对象其实是一个包含了生命周期函数的对象，例如：{ bootstrap: async () => {}, mount, unmount }
    // 详见 https://single-spa.js.org/docs/configuration#application-as-second-argument

    // 如果 app 参数是函数，那么函数的返回值是一个包含了生命周期函数的对象，例如：() => Promise.resolve({ bootstrap: async () => {}, mount, unmount })
    // 详见 https://single-spa.js.org/docs/configuration/#activity-function

    // 重点可以分析一下 TypeScript 定义

    // 这里可以先使用一下 require 试试，或者常规的 import 试试
    app: () => import("react-micro-app").then(res => getAppLifeCycles(res)),

    // activeWhen 参数可以是一个字符串，也可以是一个函数，还可以是一个数组

    // TypeScript 定义
    // type ActivityFn = (location: Location) => boolean;
    // type Activity = ActivityFn | string | (ActivityFn | string)[];
    activeWhen: MICRO_APP_ROUTER.REACT,

    // customProps 参数可以是一个对象，也可以是一个函数
    // 主要作用是传递给子应用的 props
    customProps: {
      // 这里将元素的 id 传递给子应用，子应用可以通过 props 获取到，获取到后可以在子应用的 mount、unmount 生命周期中使用
      // 子应用可以将自己的内容渲染到这个元素中，从而实现子应用的渲染
      container: MICRO_APP_CONTAINER_ID,
    },
  },
  {
    name: "vue",
    app: () => import("vue-micro-app").then(res => getAppLifeCycles(res)),
    activeWhen: MICRO_APP_ROUTER.VUE,
    customProps: {
      container: MICRO_APP_CONTAINER_ID,
    },
  },
]);

// 当 main-app 的路由发生变化时，会触发子应用的 mount 和 unmount 生命周期
// 在子应用中通过 props 获取到 container，然后将自己的内容渲染到 container 中
// container 元素则是在 main-app 中定义的，例如：React 的 container 元素是 <div id={MICRO_APP_CONTAINER_ID.REACT}></div>，Vue 的 container 元素是 <div id={MICRO_APP_CONTAINER_ID.VUE}></div>
// 通过 /react 和 /vue 路由切换时，首先会渲染子应用的 container 元素，然后触发子应用的 mount 将自己的内容渲染到 container 元素中

const router = createBrowserRouter([
  {
    path: "/",
    // <App /> 中提供了左侧导航栏和右侧内容区域
    // 左侧导航栏中有两个路由，分别是 react 和 vue
    // 右侧内容区域中主要用于渲染子应用的容器元素 <div id={MICRO_APP_CONTAINER_ID.REACT}></div> 和 <div id={MICRO_APP_CONTAINER_ID.VUE}></div>
    element: <App />,
    // children 中的元素会被渲染到 <App /> 的 <Outlet /> 中
    // <Outlet> 是 react-router-dom 提供的一个组件，用于渲染子路由：https://reactrouter.com/en/main/components/outlet
    children: [
      // 如果有其它需要处理的路由，可以先前置处理，例如：
      // {
      //   path: '/aaa',
      //   element: <div>111</div>,
      // },

      // 其它子路由都匹配成子应用的容器元素，注意也可以将注册 API 里的数据单独罗列出来，然后遍历生成路由
      // 在真实的业务场景中，往往注册 API 里的数据和路由都是根据后端的数据动态生成的
      {
        path: '*',
        element: <div id={MICRO_APP_CONTAINER_ID}></div>,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

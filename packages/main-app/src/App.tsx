import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { mockMicroApps } from "./utils/micros.ts";

function App() {
  return (
    <div className="app">
      <div className="app-nav">
        <p>Micro App List</p>
        <nav>
          <ul>
            {/* 遍历微应用的数据列表生成导航路由信息 */}
            {mockMicroApps.map((item) => (
              <li key={item.name}>
                <Link to={item.router}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="app-content">
        {/* 这里的 <Outlet /> 会被 <RouterProvider router={router} /> 中 router 提供的 children 进行替换 */}
        {/* 所以本质上会被微应用的容器元素 <div id={MICRO_APP_CONTAINER_ID}></div> 替代  */}
        <Outlet />
      </div>
    </div>
  );
}

export default App;

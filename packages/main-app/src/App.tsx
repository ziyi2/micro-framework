import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { mockMicroApps } from "./utils/micros";

function App() {
  return (
    <>
      {/* 新增一个 h1 标签，用于测试样式干扰 */}
      <h1 className="app-h1">Hello, Main App</h1>
      <div className="app">
        <div className="app-nav">
          <p>Micro App List</p>
          <nav>
            <ul>
              {mockMicroApps.map((item) => (
                <li key={item.name}>
                  <Link to={item.activeRule}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;

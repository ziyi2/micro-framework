import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { MICRO_APP_ROUTER, mockMicroApps } from "./utils/micros";

function App() {
  return (
    <div className="app">
      <div className="app-nav">
        <p>Micro App List</p>
        <nav>
          <ul>
            {mockMicroApps.map((item) => (
              <li key={item.name}>
                <Link to={item.router}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;

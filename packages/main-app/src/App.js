import { Outlet, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="app-nav">
        <p>Micro App List</p>
        <nav>
          <ul>
            <li>
              <Link to={'react'}>React Micro App</Link>
            </li>
            <li>
              <Link to={'vue'}>Vue Micro App</Link>
            </li>
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

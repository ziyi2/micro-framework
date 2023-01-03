import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="app-nav">
        <p>Micro App List</p>
        <nav>
          <ul>
            <li>
              <a href={`/angular`}>Angular Micro App</a>
            </li>
            <li>
              <a href={`/vue`}>Vue Micro App</a>
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

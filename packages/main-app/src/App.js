import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { MICRO_APP_ROUTER } from './utils/micros'

function App() {
  return (
    <div className="app">
      <div className="app-nav">
        <p>Micro App List</p>
        <nav>
          <ul>
            <li>
              <Link to={MICRO_APP_ROUTER.REACT}>React Micro App</Link>
            </li>
            <li>
              <Link to={MICRO_APP_ROUTER.VUE}>Vue Micro App</Link>
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

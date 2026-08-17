import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Overview from "./pages/Overview";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";

function App() {
  const token = localStorage.getItem("token");

  // Apply saved theme whenever the app loads
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") || "light";

    document.body.classList.toggle(
      "dark-mode",
      savedTheme === "dark"
    );
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}

        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* MAIN APP */}
        
        <Route path="/dashboard" element={<Overview />} />

        {/* <Route
          path="/dashboard"
          element={
            token ? (
              <Overview />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        /> */}

        <Route
          path="/tasks"
          element={
            token ? (
              <Tasks />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/settings"
          element={
            token ? (
              <Settings />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* UNKNOWN ROUTE */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
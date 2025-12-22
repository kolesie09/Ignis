import React, { useState } from "react";
import AppLayout from "./layout/AppLayout.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./layout/Routing.jsx";

function App() {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  const [registered, setRegistered] = useState(
    localStorage.getItem("registered") === "true"
  );

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("authenticated");
  };

  const handleRegister = () => {
    setRegistered(false);
    localStorage.removeItem("registered");
  };

  const handleSwitchToLogin = () => {
    setRegistered(true);
    localStorage.setItem("registered", "true");
  };

  if (!authenticated) {
    if (!registered) {
      return (
        <Register
          setRegistered={setRegistered}
          handleSwitchToLogin={handleSwitchToLogin}
        />
      );
    } else {
      return (
        <Login
          setAuthenticated={setAuthenticated}
          setRegistered={setRegistered}
          handleRegister={handleRegister}
        />
      );
    }
  } else {
    return <RouterProvider router={router} />;
  }
}

export default App;

import React, { useState } from "react";
import AppLayout from "./layout/AppLayout.jsx";
import Login from "./pages/auth/Login.jsx";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <Login setAuthenticated={setAuthenticated} />;
  } else {
    return <AppLayout />;
  }
}

export default App;

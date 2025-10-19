import React from "react";
import AppLayout from "./layout/AppLayout.jsx";
import Home from "./pages/Home.jsx";
function App() {
  const [page, setPage] = React.useState("dashboard");
  const [selected, setSelected] = React.useState(null);

  return <AppLayout />;
}

export default App;

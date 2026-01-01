import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "../pages/Dashboard.jsx";
import DepartureCard from "../pages/documents/Departurecard.jsx";
import Firefighter from "../pages/statistics/Firefighter.jsx";
import MyAccount from "../pages/administration/MyAccount.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/Home.jsx";
import History from "../pages/documents/History.jsx";

export const router = createBrowserRouter([
  // Strony publiczne
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // Strony prywatne z AppLayout
  {
    path: "/",
    element: <AppLayout handleLogout={() => console.log("Logout")} />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Home />,
      },
      {
        path: "documents/departurecard",
        element: <DepartureCard />,
      },
      {
        path: "documents/history",
        element: <History />,
      },
      {
        path: "statistics",
        element: <Firefighter />,
        children: [
          {
            path: "firefighter",
            element: <Firefighter />,
          },
        ],
      },
      {
        path: "myaccount",
        element: <MyAccount />,
      },
      // Dodaj inne prywatne strony w podobny sposób
    ],
  },
]);

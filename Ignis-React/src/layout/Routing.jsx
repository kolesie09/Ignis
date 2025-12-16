import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import Home from "../pages/Home.jsx";
import DepartureCard from "../pages/documents/Departurecard.jsx";
import Firefighter from "../pages/statistics/Firefighter.jsx";
import MyAccount from "../pages/administration/MyAccount.jsx";
import Login from "../pages/auth/Login.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/documents/departurecard", element: <DepartureCard /> },
  { path: "/statistics/firefighter", element: <Firefighter /> },
  { path: "/administration/myaccount", element: <MyAccount /> },
  { path: "/my-account", element: <MyAccount /> },
  { path: "/login", element: <Login /> },
]);

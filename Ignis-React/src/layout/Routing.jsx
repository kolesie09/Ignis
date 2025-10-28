import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import Home from "../pages/Home.jsx";
import DepartureCard from "../pages/documents/Departurecard.jsx";
import Firefighter from "../pages/statistics/Firefighter.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
  { path: "/documents/departurecard", element: <DepartureCard /> },
  { path: "/statistics/firefighter", element: <Firefighter /> },
]);

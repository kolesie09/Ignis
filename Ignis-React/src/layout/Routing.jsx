import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import DepartureCard from "../pages/documents/Departurecard.jsx";
import Firefighter from "../pages/statistics/Firefighter.jsx";
import MyAccount from "../pages/administration/MyAccount.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/Home.jsx";
import History from "../pages/documents/History.jsx";
import CardEdit from "../pages/documents/card/CardEdit.jsx";

import CardDeparture from "../pages/documents/card/CardDeparture.jsx";
import CardDetails from "../pages/documents/card/CardDetails.jsx";
import CardDepartureUser from "../pages/documents/card/CardDepartureUser.jsx";
import { RequireAuth } from "../context/RequireAuth.jsx";
import Firefighters from "../pages/firefighters/Firefighters.jsx";

export const router = createBrowserRouter([
  // Strony publiczne
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // Strony prywatne z AppLayout
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
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
        path: "firefighters",
        element: <Firefighters />,
      },
      {
        path: "documents/history/card/:id",
        element: <CardDetails />,
      },
      {
        path: "documents/history/card/:id/edit",
        element: <CardEdit />,
      },
      {
        path: "documents/history/:user",
        element: <CardDepartureUser />,
      },
      {
        path: "documents",
        children: [
          {
            path: "departurecard",
            element: <DepartureCard />,
          },
          {
            path: "history",
            element: <History />,
          },
        ],
      },
      {
        path: "statistics",
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
    ],
  },
]);

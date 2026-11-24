import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import DepartureCard from "../pages/documents/Departurecard.jsx";
import FirefighterStatistics from "../pages/statistics/FirefighterStatistics.jsx";
import MyAccount from "../pages/administration/MyAccount.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Home from "../pages/Home.jsx";
import History from "../pages/documents/History.jsx";
import CardEdit from "../pages/documents/card/CardEdit.jsx";
import MembershipFees from "../pages/administration/MembershipFees.jsx";
import Settings from "../pages/settings/Settings.jsx";
import { RequireRole } from "../context/RequireRole.jsx";
import FireStations from "../pages/settings/FireStations.jsx";

import CardDeparture from "../pages/documents/card/CardDeparture.jsx";
import CardDetails from "../pages/documents/card/CardDetails.jsx";
import CardDepartureUser from "../pages/documents/card/CardDepartureUser.jsx";
import { RequireAuth } from "../context/RequireAuth.jsx";
import Firefighters from "../pages/settings/Firefighters.jsx";
import Invitations from "../pages/settings/Invitations.jsx";
import FirefighterCard from "../pages/settings/FirefighterCard.jsx";

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
            path: "firefighterstatistics",
            element: <FirefighterStatistics />,
          },
        ],
      },
      {
        path: "administration",
        children: [
          {
            path: "myaccount",
            element: <MyAccount />,
          },
          {
            path: "membershipfees",
            element: <MembershipFees />,
          },
        ],
      },
      {
        path: "settings",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
            <Settings />
          </RequireRole>
        ),
      },
      {
        path: "settings/firefighters",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
            <Firefighters />
          </RequireRole>
        ),
      },
      {
        path: "settings/firefighters/:id",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
            <FirefighterCard />
          </RequireRole>
        ),
      },

      {
        path: "settings/fire-stations",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
            <FireStations />
          </RequireRole>
        ),
      },
      {
        path: "settings/invitation",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]}>
            <Invitations />
          </RequireRole>
        ),
      },
      /* {
        path: "settings/users/add",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN"]}>
            <UserAdd />
          </RequireRole>
        ),
      },
      {
        path: "settings/users",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN"]}>
            <UsersManagement />
          </RequireRole>
        ),
      },
      {
        path: "settings/roles",
        element: (
          <RequireRole allowedRoles={["ROLE_ADMIN"]}>
            <RolesManagement />
          </RequireRole>
        ),
      }, */
    ],
  },
]);

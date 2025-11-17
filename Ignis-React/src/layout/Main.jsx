import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./AppLayout.jsx";

// Strony
import Dashboard from "../pages/Dashboard.jsx";
import Projects from "../pages/Projects.jsx";
import Calendar from "../pages/Calendar.jsx";
import Reports from "../pages/Reports.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // stały layout (sidebar + header)
    children: [
      { index: true, element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "calendar", element: <Calendar /> },
      { path: "reports", element: <Reports /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

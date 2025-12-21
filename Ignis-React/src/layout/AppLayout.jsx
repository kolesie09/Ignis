import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { router } from "./Routing.jsx";

import { RouterProvider } from "react-router-dom";

export default function AppLayout({ handleLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, _setDarkMode] = useState(false);

  return (
    <div
      className={`flex bg-gray-100 h-screen ${
        darkMode ? "dark" : ""
      } dark:bg-gray-900`}
    >
      {/* sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* main content */}
      <main className="flex-1 flex flex-col">
        {/* HEADER (stały) */}
        <header className="bg-white flex justify-between p-4 dark:bg-gray-900">
          <button
            className="p-2 text-xl font-bold lg:hidden dark:text-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold dark:text-gray-100">IGNIS</h1>
          <div
            onClick={handleLogout}
            className="bg-gray-300 w-10 h-10 rounded-full"
          ></div>
        </header>

        {/* TU SIĘ ZMIENIA TYLKO ZAWARTOŚĆ STRONY */}
        <div className="p-4 flex-1 overflow-auto">
          <RouterProvider router={router} />
        </div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

import { Outlet } from "react-router-dom";

export default function AppLayout({ handleLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, _setDarkMode] = useState(false);

  return (
    <div
      className={`flex bg-gray-100  w-full h-screen ${
        darkMode ? "dark" : ""
      } dark:bg-gray-900`}
    >
      {/* sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* main content */}
      <main className="flex-1 flex flex-col w-screen">
        {/* HEADER (stały) */}
        <Header
          handleLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="p-1 md:p-4 flex-1 overflow-auto ">
          {/* 2. TU WSTAWIAMY OUTLET - tutaj wpadną Twoje podstrony */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

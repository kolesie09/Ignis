import { Menu, Search, Bell, User, LogOut } from "lucide-react";
import { Button } from "../components/Button.jsx";
import React, { useState, useRef, useEffect } from "react";

export default function Header({ handleLogout, onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white flex justify-between p-4 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <Menu
          className="h-6 w-6 text-gray-800 cursor-pointer lg:hidden dark:text-gray-100"
          onClick={onMenuClick}
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          OSP Barlinek
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />

        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700"
          >
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-200 rounded-md shadow-lg z-50">
              <Button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-500"
                icon={LogOut}
              >
                Wyloguj się
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
